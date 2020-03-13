import puppeteer from 'puppeteer';
import urlPageResultIds from './services/pageIdScrapeService';
import contentScraper from './services/contentScrapeService';
import { ScrapeResults, PageObject } from './types';
import generateError from './utils/generateError';
import { articlesPromedRef } from './firebase/collectionReferences';

const queryScrapePosts = async (queryUrl: string) => {
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
      const results: Promise<PageObject>[] = 
        idResults.results
          .map((pageId: string) => contentScraper(pageId, browser));
 
      const processedResults: PageObject[] = (await Promise.all(results))
        .filter((pageContent) => pageContent && pageContent.id);
        
      await browser.close();

      // Save to firestore
      processedResults.forEach(async (pageData) => {
        if (pageData.id) {
          await articlesPromedRef.doc(pageData.id).set(pageData);
        }
      });
      return processedResults;
    } 

    return generateError(500, "Error while querying", "Query failed unexpectedly.");
  } catch (error) {
    console.error("Something went wrong while scraping. Try restarting the server.");
    console.error(error);
    await browser.close();
    return error;
  }
};

export default queryScrapePosts;
