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

// How many pages to scrape per call max
const scrapeCap = 30;

// Minimum articles to return when count is not set
const minGeneralArticles = 5;

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
    const idResults: ScrapeResults | GenError = await urlPageResultIds(
      formattedQuery as URLFormattedTerms,
      browser,
    );
 
    if (isError(idResults)) return idResults;

    const results: Promise<PageObject>[] = 
      idResults.results
        .splice(0, scrapeCap)
        .map((pageId: string) => contentScraper(pageId, browser));

    const processedResults: PageObject[] = (await Promise.all(results))
      .filter((pageContent) => pageContent && pageContent.id);
      
    await browser.close();
    console.log("Scraped pages successfully.");

    // Save to firestore
    processedResults.forEach(async (pageData) => {
      if (pageData.id) {
        await articlesRef.doc(pageData.id).set(pageData);
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

  const formatStartDate: Date = getNormalisedDate(startDate);
  const formatEndDate: Date = getNormalisedDate(endDate);

  const fetchArticles = await articlesRef.get();
  const allArticles: FirebaseFirestore.DocumentData[] = 
    fetchArticles.docs.map((document) => document.data());

  const filteredArticles = allArticles
    // Country filter
    .filter((document) => document.reports && document.reports[0]?.locations?.some(
      (locationDetails: Location) => 
        (location ? locationDetails.country?.toLowerCase() === location.toLowerCase() : true),
    ))
    // Date filter
    .filter((document) => {
      const date: Date = getNormalisedDate(document.date_of_publication);
      if (date >= formatStartDate && date <= formatEndDate) {
        return true;
      }
      return false;
    })
    // Keyterms filter
    .filter((document) => document.reports && document.reports[0]?.diseases?.some(
      (disease: string) => {
        if (keyTerms && keyTerms?.length) {
          if (keyTerms.includes(disease.toLowerCase())) {
            return true;
          }
          return false;
        }
        return true;
      },
    ));
      
  console.log(`${filteredArticles.length} articles fetched.`);
  if (!count && filteredArticles.length < minGeneralArticles) {
    console.log("Failed to find articles in DB. Scraping instead...");
    return getArticlesForceScrape(queryUrl);
  }

  if (count && page && ((count * page + count) > filteredArticles.length)) {
    console.log("Page exceeds article limit.");
    return generateError(500, "Page max reached", "Current page exceeds total articles remaining.");
  }
  
  return count ? 
    filteredArticles.splice(page ? count * page : 0, count) as PageObject[] : 
    filteredArticles as PageObject[];
};
