import puppeteer from 'puppeteer';
import firestoreUrlPageResultIds from './services/firestorePageIdScrapeService';
import contentScraper from './services/contentScrapeService';
import { ScrapeResults, PageObject } from './types';
import generateError from './utils/generateError';

const firestoreScrapedPosts = async (queryUrl: string) => {
  const browser = await puppeteer.launch();

  try {
    const idResults: ScrapeResults = await firestoreUrlPageResultIds(
      queryUrl,
      browser,
    );
 
    if (idResults.error) {
      console.error(idResults.error);
      return idResults.error;
    } 
    
    if (idResults.results) {
      const results: Promise<PageObject | undefined>[] = 
        idResults.results
          .map((pageId: string) => contentScraper(pageId, browser));
 
      const processedResults = (await Promise.all(results))
        // Remove null or empty pages
        .filter((pageContent) => pageContent);
        
      await browser.close();
      return processedResults;
    } 

    return generateError(400, "---", "Error while querying");
  } catch (error) {
    console.error("Something went wrong while scraping. Try restarting the server.");
    console.error(error);
    await browser.close();
    return error;
  }
};

export default firestoreScrapedPosts;
