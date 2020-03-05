/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import * as express from 'express';
import * as admin from 'firebase-admin';
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

/*

// Example request from firestore

const getUsername = async (userId: string) => {
  // --> Usually you would also test for authentication
  // here before calling the function, i.e. the function
  // should receive some sort of authentication token here which
  // your firebase admin account can verify that the client
  // is authenticated
  // <--

  // --> How to fetch a doc from firebase
  try {
    // Admin is who has access to firebase
    // Reference firestore and get the document you need
    // Make sure to await since its async call
    const getTestUserDocument = await admin
      .firestore()
      .doc(`users/${userId}`)
      .get();

    // Convert the document into usable data
    const testUserUsername = getTestUserDocument.data();
    return testUserUsername?.username;
  } catch (error) {
    throw new Error(error);
  }
};

*/

/*

const puppeteer = require("puppeteer");


--> Heres an example of some basic puppeteer interactions
    We start by opening a headless instance of chrome (without the GUI)
    and wait for the page to load. We then navigate to the promed search page.
    We find then find the input html element with id=searchterm and input our search query.
    Create a DOM variable containing the submit button and click it.
    Hit the submit button.
    We wait for the page to load and then take a screen shot.
const startPuppeteer = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  await page.goto("https://promedmail.org/promed-posts/");
  await page.$eval(
    "#searchterm",
    (el: { value: string }) => (el.value = "coronavirus")
  );
  const submitButton = await page.$(
    'form[name="as_form"] input[type="submit"]'
  );
  await submitButton.click();
  // await page.click('input[type="submit"]');
  await page.waitFor(10000);
  await page.screenshot({ path: "test.png" });
  console.log("Screenshotted");
  // other actions...
  await browser.close();
};
*/

/*

--> Heres an example of filtering through a firestore collection
    and getting top 10 usernames in ascending order
    and mapping into an array

const usersCollection = await admin
  .firestore()
  .collection("users")
  .where("username", ">=", args.username.toLowerCase())
  .orderBy("username", "asc")
  .limit(10)
  .get();
const usersDocs = usersCollection.docs.map((doc) => doc.data());

*/

app.get('/', async (req, res) => {
  // I commented out the below call as it was
  // causing the server to crash? - matthew
  // const getData = await getUsername("test");

  // await startPuppeteer();
  const idResults: ScrapeResults = await promedURLResultIDs(
    '?keyterms=coronavirus&startdate=2019-12-01T00:00:00&enddate=2020-02-01T00:00:00&location=china',
  );

  if (idResults.error) {
    console.log(idResults.error);
  } else if (idResults.results) {
    const results: Promise<PageObject[]>[] | undefined = 
      idResults.results.map((pageId: string) => getJSONResults(pageId));

    const processedResults = await Promise.all(results);
    res.send(processedResults);
    console.log(processedResults);
  }

  // TODO: case goes here if scrape dies for some reason
});

app.listen(process.env.PORT || port, () => console.log(`Server is listening on ${port}`));
