/* eslint-disable no-await-in-loop */
import puppeteer from 'puppeteer';
import urlPageResultIds from './services/pageIdScrapeService';
import contentScraper from './services/contentScrapeService';
import {
  ScrapeResults, PageObject, GenError, URLFormattedTerms, Location, 
} from './types';
import { articlesRef } from './firebase/collectionReferences';
import { formatQueryUrl, getNormalisedDate } from './utils/formatters';
import puppeteerConfig from './constants/puppeteerConfig';
import { isError } from './utils/checkFunctions';
import generateError from './utils/generateError';

// Minimum articles to return when count is not set
const minGeneralArticles = 5;

// Max number of promises to be running
const chunkSize = 5;

// Max articles to read from the db
const readHardCap = 75;

// Click the cookies button preliminarily for promed site
const checkCookieButton = "document.getElementById('CybotCookiebotDialogBodyLevelButtonAccept') !== null";

export const getArticlesForceScrape = async (queryUrl: string): (
  Promise<PageObject[] | GenError> 
) => {
  const formattedQuery = formatQueryUrl(queryUrl);
  if (isError(formattedQuery)) {
    console.log(formattedQuery);
    return formattedQuery;
  }

  const browser = await puppeteer.launch(puppeteerConfig);

  try {
    const page = await browser.newPage();
    await page.goto('https://promedmail.org/promed-posts/', { waitUntil: 'networkidle0' });
    await page.waitForFunction(checkCookieButton);
    await page.click("#CybotCookiebotDialogBodyLevelButtonAccept");
    await page.waitFor(1000);
  } catch (error) {
    console.log('Tried to click the promed cookies button but it did not appear');
  }

  try {
    const idResults: ScrapeResults | GenError = await urlPageResultIds(
      formattedQuery as URLFormattedTerms,
      browser,
    );
 
    if (isError(idResults)) {
      console.log(idResults);
      return idResults;
    }

    let processedResults: PageObject[] = [];
    for (let index = 0; index < idResults.results.length; index += chunkSize) {
      const tempResults = idResults.results.slice(index, index + chunkSize);
      const pagePromiseGroup: Promise<PageObject>[] = tempResults.map((pageID: string) => 
        contentScraper(pageID, browser));
      processedResults = processedResults.concat(await Promise.all(pagePromiseGroup));
    }
    processedResults = processedResults.filter((pageContent) => pageContent && pageContent.id);
      
    await browser.close();
    console.log("Scraped pages successfully.");

    // Save to firestore
    processedResults.forEach(async (pageData) => {
      if (pageData.id) {
        // Format page data for easier firestore indexing
        const searchTerms: string[] = [
          ...pageData.reports[0].syndromes, 
          ...pageData.reports[0].diseases,
        ];
        const timestamp: number = getNormalisedDate(pageData.date_of_publication).getTime() / 1000;
        const locationsRaw: string[] = [];
        pageData.reports[0].locations.forEach((location: Location) => {
          locationsRaw.push(location.country.toLowerCase());
          locationsRaw.push(location.location?.toLowerCase() || "");
          locationsRaw.push(location.subArea?.toLowerCase() || "");
        });
        const locations: string[] = [...new Set(
          locationsRaw.filter((strLocation) => strLocation && strLocation !== ""),
        )];

        const pageId = pageData.id;

        locations.forEach(async (location) => {
          await articlesRef.doc(location).collection("articles").doc(pageId).set({
            ...pageData,
            _timestamp: timestamp,
            _search: searchTerms,
          });
        });
      }
    });
    
    return processedResults;
  } catch (error) {
    await browser.close();
    console.log("Something went wrong while scraping. Try restarting the server.");
    console.log(error);
    // TODO: Should return our own error here
    return error;
  }
};

export const getArticles = async (queryUrl: string): (
  Promise<PageObject[] | GenError> 
) => {
  const formattedQuery = formatQueryUrl(queryUrl);
  if (isError(formattedQuery)) return formattedQuery;
  const {
    keyTerms, startDate, endDate, location, count, page,
  } = formattedQuery;

  const startDateTimestamp = getNormalisedDate(startDate).getTime() / 1000;
  const endDateTimestamp = getNormalisedDate(endDate).getTime() / 1000;

  const fetchArticles = await articlesRef
    .doc(location.toLowerCase())
    .collection("articles")
    .where("_search", "array-contains-any", keyTerms)
    .where("_timestamp", ">=", startDateTimestamp)
    .where("_timestamp", "<=", endDateTimestamp)
    .orderBy("_timestamp", "asc")
    .limit(count ? count * ((page ?? 0) + 1) : readHardCap)
    .get();

  const filteredArticles: PageObject[] = fetchArticles.docs
    .map((document: any) => document.data())
    .map((document: any) => {
      delete document._timestamp;
      return document as PageObject;
    });

  console.log(`${filteredArticles.length} articles fetched.`);
  if (!count && filteredArticles.length < minGeneralArticles) {
    console.log("Failed to find articles in DB. Scraping instead...");
    return getArticlesForceScrape(queryUrl);
  }

  if (count && page && ((count * page + count) > filteredArticles.length)) {
    console.log("Page exceeds article limit.");
    return generateError(500, "Page max reached", "Current page exceeds total articles remaining");
  }
  
  return count ? 
    filteredArticles.splice(page ? count * page : 0, count) : 
    filteredArticles;
};
