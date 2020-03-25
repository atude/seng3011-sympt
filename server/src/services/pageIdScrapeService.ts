/* eslint-disable no-await-in-loop */
import { ScrapeResults, URLFormattedTerms, GenError } from '../types';
import generateError from '../utils/generateError';
import { peelIDFromResultLinks } from './idScraperService';

const checkSubmitButton = "document.getElementsByName('submit') !== null";
const idLimitCap = 100;

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

    let searchResultIdsFiltered = await peelIDFromResultLinks(page);
    
    try {
      while (page.$('form[id=search_hidden] > p > input[value=next]')) {
        await page.waitForSelector('form[id=search_hidden] > p > input[value=next]', { timeout: 1500 });
        await page.click('form[id=search_hidden] > p > input[value=next]');
        searchResultIdsFiltered = searchResultIdsFiltered.concat(await peelIDFromResultLinks(page));
      }
    } catch (error) {
      console.log('Scraped the final page of results');
    } finally {
      await page.close();
    }

    let finalIdsArray = [];
    const idSkip = Math.floor(searchResultIdsFiltered.length / idLimitCap);
    
    if (!idSkip) {
      finalIdsArray = searchResultIdsFiltered;
    } else {
      for (let i = 0; finalIdsArray.length < idLimitCap; i += idSkip) {
        finalIdsArray.push(searchResultIdsFiltered[i]);
      }
    }

    console.log(finalIdsArray);

    finalIdsArray = finalIdsArray
      .filter((result) => result);

    if (finalIdsArray && finalIdsArray.length) {
      console.log(`Successfully pulled ids.`);
      return { results: finalIdsArray };
    }

    // Not enough results
    throw Error();
  } catch (error) {
    console.log(error);
    return generateError(500, "Insufficient articles", "Could not find articles with these parameters");
  }
};

export default urlPageResultIds;
