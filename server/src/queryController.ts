import * as puppeteer from 'puppeteer';
import urlPageResultIds from './services/pageIdScrapeService';
import contentScraper from './services/contentScrapeService';
import { ScrapeResults, PageObject } from './types';

export const queryScrapePosts = async (queryUrl: string) => {
  const browser = await puppeteer.launch();

  try {
    const idResults: ScrapeResults = await urlPageResultIds(
      queryUrl,
      browser,
    );
 
    if (idResults.error) {
      console.error(idResults.error);
      return idResults.error;
    } 
    
    if (idResults.results) {
      const results: Promise<PageObject | undefined>[] = 
        idResults.results.map((pageId: string) => contentScraper(pageId, browser));
 
      const processedResults = await Promise.all(results);
      return processedResults;
      // console.log(processedResults);
    }
  } catch (error) {
    console.error("Something went wrong while scraping. Try restarting the server.");
    console.error(error);
    return error;
  }
 
  await browser.close();
};

export const yes = 3;
