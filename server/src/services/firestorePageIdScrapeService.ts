import { ScrapeResults } from '../types';
import generateError from '../utils/generateError';

const checkSubmitButton = "document.getElementsByName('submit') !== null";
const checkSearchResults = "document.getElementById('search_results')?.childElementCount !== 0";

// takes a url query string of the form
// ?keyterms=something[,somethingelse,hi]
// &startdate=yyyy:mm:ddTHH:MM:SS
// &enddate=yyyy:mm:ddTHH:MM:SS
// &location=somewhere
//
// Return an array of ids for pages to scrape from
const firestoreUrlPageResultIds = async (
  urlSearchQueries: string, 
  browserInstance: any,
): Promise<ScrapeResults> => {
  const urlParams = new URLSearchParams(urlSearchQueries);
  const keyTerms = urlParams.get('keyterms');

  if (keyTerms === null) {
    return generateError(403, "Bad Request", "No specified keyterm(s).");
  }

  // Join listed keywords by ' AND ' and append location
  const formattedKeyTerms: string = `${keyTerms?.split(',').join(' AND ')}`;

  const page = await browserInstance.newPage();
  await page.goto('https://promedmail.org/promed-posts/', {
    waitUntil: 'networkidle2',
    timeout: 300000,
  });

  // type in key terms
  await page.waitForSelector('#searchterm');
  await page.focus('#searchterm');
  await page.keyboard.type(formattedKeyTerms);

  // include archive numbers on results
  await page.waitForSelector('#show_us');
  await page.click('#show_us');

  // include search terms in the subject body
  await page.waitForSelector('#kwby2');
  await page.click('#kwby2');

  // click on the search button
  await page.waitForFunction(checkSubmitButton);
  const submitButton = await page.$(
    'form[name="as_form"] input[type="submit"]',
  );
  await submitButton?.click();

  await page.waitForFunction(checkSearchResults);

  // grab the results from the table (this includes any inner html objects)
  // extract the id of the result with a regex expression and append the
  // id to the list on match
  const searchResultIDs: string[] = await page.evaluate(() => {
    const linkIDRegex = /([0-9]+)<\/a>$/g;
    const searchResultsList = document.getElementById('search_results')?.children;

    if (searchResultsList) {
      const results = Array.from(searchResultsList).map((result) => {
        const getIdFromTitle = result.children[0].innerHTML.match(linkIDRegex);
        if (getIdFromTitle) {
          return getIdFromTitle[0].replace(/<\/a>/, '');
        } 
        return "";
      });

      return results;
    }

    return [];
  });

  await page.close();
  return { results: searchResultIDs };
};

export default firestoreUrlPageResultIds;
