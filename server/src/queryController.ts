import puppeteer from 'puppeteer';
import urlPageResultIds from './services/pageIdScrapeService';
import contentScraper from './services/contentScrapeService';
import {
  ScrapeResults, PageObject, GenError, URLFormattedTerms, 
} from './types';
import { articlesRef } from './firebase/collectionReferences';
import { formatQueryUrl } from './utils/formatters';
import puppeteerConfig from './constants/puppeteerConfig';
import { isError } from './utils/checkFunctions';

// In future cases, use pagination instead of hardcap
const queryCap = 6;

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
  console.log("x");
  return getArticlesForceScrape(queryUrl);
};
