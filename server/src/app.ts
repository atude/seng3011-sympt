import * as express from 'express';
import * as admin from 'firebase-admin';
import * as puppeteer from 'puppeteer';
import promedURLResultIDs from './puppeteerResultIDScraper';
import getJSONResults from './puppeteerPageScraper';
import { ScrapeResults, PageObject } from './types';

const serviceAccount = require('../service-account.json');

// Init firebase service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 4000;

const exampleQuery = '?keyterms=coronavirus&startdate=2019-12-01T00:00:00&enddate=2020-02-01T00:00:00&location=china';

app.get('/', async (req, res) => {
  const browser = await puppeteer.launch();

  try {
    const idResults: ScrapeResults = await promedURLResultIDs(
      exampleQuery,
      browser,
    );

    if (idResults.error) {
      console.error(idResults.error);
    } else if (idResults.results) {
      const results: Promise<PageObject[] | undefined>[] = 
        idResults.results.map((pageId: string) => getJSONResults(pageId, browser));

      const processedResults = await Promise.all(results);
      res.send(processedResults);
      // console.log(processedResults);
    }
  } catch (error) {
    console.error("Something went wrong while scraping. Try restarting the server.");
    console.error(error);
  }

  await browser.close();
});

app.listen(process.env.PORT || port, () => console.log(`--> Server is listening on ${port}`));
