import puppeteer from 'puppeteer';
import urlPageResultIds from './services/pageIdScrapeService';
import contentScraper from './services/contentScrapeService';
import {
  ScrapeResults, PageObject, GenError, URLFormattedTerms, Location, 
} from './types';
import { articlesRef } from './firebase/collectionReferences';
import { formatQueryUrl } from './utils/formatters';
import puppeteerConfig from './constants/puppeteerConfig';
import { isError } from './utils/checkFunctions';

// In future cases, use pagination instead of hardcap
const queryCap = 10;

export const getArticlesForceScrape = async (queryUrl: string): (
  Promise<PageObject[] | GenError> 
) => {
  const formattedQuery = formatQueryUrl(queryUrl);
  if (isError(formattedQuery)) return formattedQuery;

  const browser = await puppeteer.launch(puppeteerConfig);

  try {
    const idResults: ScrapeResults | GenError = await urlPageResultIds(
      formattedQuery as URLFormattedTerms,
      browser,
    );
 
    if (isError(idResults)) return idResults;

    const results: Promise<PageObject>[] = 
      idResults.results
        .splice(0, queryCap)
        .map((pageId: string) => contentScraper(pageId, browser));

    const processedResults: PageObject[] = (await Promise.all(results))
      .filter((pageContent) => pageContent && pageContent.id);
      
    await browser.close();

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
    keyTerms, startDate, endDate, location, 
  } = formattedQuery;

  const formatStartDate = new Date(startDate);
  const formatEndDate = new Date(endDate);

  console.log(formatStartDate, formatEndDate);
  const fetchArticles = await articlesRef.get();
  const allArticles: FirebaseFirestore.DocumentData[] = 
    fetchArticles.docs.map((document) => document.data());

  const filteredArticles = allArticles
    // Country filter
    .filter((document) => document.reports[0].locations.some(
      (locationDetails: Location) => 
        (location ? locationDetails.country?.toLowerCase() === location : true),
    ))
    // Date filter
    .filter((document) => {
      const date: Date = new Date(document.date_of_publication);
      if (date >= formatStartDate && date <= formatEndDate) {
        return true;
      }
      return false;
    })
    // Keyterms filter
    .filter((document) => document.reports[0].diseases.some(
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
      
  if (!filteredArticles.length) {
    console.log("Failed to find articles in DB. Scraping instead...");
    return getArticlesForceScrape(queryUrl);
  }
  
  return filteredArticles as PageObject[];
};
