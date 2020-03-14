import puppeteer from 'puppeteer';
import urlPageResultIds from './services/pageIdScrapeService';
import contentScraper from './services/contentScrapeService';
import { ScrapeResults, PageObject } from './types';
import generateError from './utils/generateError';
import { articlesPromedRef } from './firebase/collectionReferences';

import * as admin from 'firebase-admin';

const queryScrapePosts = async (queryUrl: string) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

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

const querySpecificPosts = async (queryUrl: string) => {
  
  queryUrl = queryUrl.split("?")[1]
  const tokens: string[] = queryUrl.split("&");
  const keyterms : string[] = tokens[0].split("=")[1].split(",");
  const startDate = tokens[1].split("=")[1];
  const endDate = tokens[2].split("=")[1];
  const location = tokens[3].split("=")[1];

  console.log("keyterms " + keyterms + " location " + location);

  try {
    const promedDocs = await admin
      .firestore()
      .collection("articles-promed")
      .where("date_of_publication", ">=", startDate)
      .where("date_of_publication", "<=", endDate)
      .get();
  const diseaseReports = promedDocs.docs.map((doc) => doc.data());
    return diseaseReports;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  queryScrapePosts,
  querySpecificPosts
}
