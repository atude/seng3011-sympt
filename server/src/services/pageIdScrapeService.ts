import { ScrapeResults, URLFormattedTerms, GenError } from '../types';
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

const urlPageResultIds = async (
  searchQueries: URLFormattedTerms, 
  browserInstance: any,
): Promise<ScrapeResults | GenError> => {
  const {
    keyTerms, startDate, endDate, location, 
  } = searchQueries;

  try {
    const page = await browserInstance.newPage();
    await page.goto('https://promedmail.org/promed-posts/', {
      waitUntil: 'networkidle2',
    });

    // type in key terms
    // Join listed keywords by ' AND ' and append location
    if (keyTerms && keyTerms.length) {
      const formattedKeyTerms: string = `${keyTerms?.join(' AND ')} AND ${location}`;
      await page.waitForSelector('#searchterm');
      await page.focus('#searchterm');
      await page.keyboard.type(formattedKeyTerms);
    }

    // type in dates
    await page.waitForSelector('#date1');
    await page.focus('#date1');
    await page.keyboard.type(startDate);

    await page.waitForSelector('#date2');
    await page.focus('#date2');
    await page.keyboard.type(endDate);

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
    const searchResultIds: string[] = await page.evaluate(() => {
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

    const searchResultIdsFiltered = searchResultIds.filter((result) => result);

    await page.close();

    if (searchResultIdsFiltered && searchResultIdsFiltered.length) {
      return { results: searchResultIdsFiltered };
    }

    // Not enough results
    throw Error();
  } catch (error) {
    console.log(error);
    return generateError(500, "Insufficient articles", "Could not find articles with these parameters.");
  }
};

export default urlPageResultIds;
