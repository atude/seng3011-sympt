import * as puppeteer from 'puppeteer';
import { ScrapeResults } from './types';

// check that the submit buttons have loaded into the page
const checkSubmitButton = () => document.getElementsByName('submit') !== null;

// check that the child elemnts of the search results div is not empty (1 if no results)
const checkSearchResults = () => document.getElementById('search_results')?.childElementCount !== 0;

// takes a url query string of the form
// ?keyterms=something[,somethingelse,hi]&startdate=yyyy:mm:ddTHH:MM:
// SS&enddate=yyyy:mm:ddTHH:MM:SS&location=somewhere
//
// if no keyterms, startdate, enddate, location specified
// return array with a single object with error info
//
// if invalid dates specified for start or end date
// return array with single object with error info
//
// otherwise return an array of ids for pages to scrape from

// TODO:
// - add tighter error checking for times supplied (none currently)
// - make use of the times supplied when parsing pages


const promedURLResultIDs = async (urlSearchQueries: string): Promise<ScrapeResults> => {
  const urlParams = new URLSearchParams(urlSearchQueries);
  const keyTerms = urlParams.get('keyterms');
  const startDate = urlParams.get('startdate');
  const endDate = urlParams.get('enddate');
  const location = urlParams.get('location');

  if (startDate === null) {
    return {
      error: {
        errorNo: 403,
        errorName: 'Bad request',
        errorMessage: 'No specified start date.',
      },
    };
  } if (endDate === null) {
    return {
      error: {
        errorNo: 403,
        errorName: 'Bad request',
        errorMessage: 'No specified end date.',
      },
    };
  } if (location === null) {
    return {
      error: {
        errorNo: 403,
        errorName: 'Bad request',
        errorMessage: 'No specified location.',
      },
    };
  } if (keyTerms === null) {
    return {
      error: {
        errorNo: 403,
        errorName: 'Bad request',
        errorMessage: 'No specified keyterm(s).',
      },
    };
  }

  // join the listed keywords together separated by ' AND '
  // with the location on the end of the key terms
  const formattedKeyTerms: string = `${keyTerms?.split(',').join(' AND ')} AND ${location}`;

  // date regex with groups
  const dateRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2}).*/;

  // compare the startdate submitted with the regex
  const startDateGroups = startDate.match(dateRegex);
  let startYear: string = '';
  let startMonth: string = '';
  let startDay: string = '';
  if (startDateGroups !== null) {
    [, startYear, startMonth, startDay] = startDateGroups;
  } else {
    return {
      error: {
        errorNo: 403,
        errorName: 'Bad request',
        errorMessage: 'Invalid start date.',
      },
    };
  }
  // format date ready for input into promed
  const formattedStartDate = `${startMonth}/${startDay}/${startYear}`;

  // compare the enddate submitted with the regex
  const endDateGroups = endDate.match(dateRegex);
  let endYear: string = '';
  let endMonth: string = '';
  let endDay: string = '';
  if (endDateGroups !== null) {
    [, endYear, endMonth, endDay] = endDateGroups;
  } else {
    return {
      error: {
        errorNo: 403,
        errorName: 'Bad request',
        errorMessage: 'Invalid end date.',
      },
    };
  }
  // format date ready for input into promed
  const formattedEndDate = `${endMonth}/${endDay}/${endYear}`;

  // format data
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://promedmail.org/promed-posts/', {
    waitUntil: 'networkidle2',
  });

  // type in key terms
  await page.waitForSelector('#searchterm');
  await page.focus('#searchterm');
  await page.keyboard.type(formattedKeyTerms);

  // type in dates
  await page.waitForSelector('#date1');
  await page.focus('#date1');
  await page.keyboard.type(formattedStartDate);

  await page.waitForSelector('#date2');
  await page.focus('#date2');
  await page.keyboard.type(formattedEndDate);

  // include archive numbers on results
  await page.waitForSelector('#show_us');
  await page.click('#show_us');

  // include search terms in the subject body
  await page.waitForSelector('#kwby2');
  await page.click('#kwby2');

  // click on the search button
  await page.waitFor(checkSubmitButton);
  const submitButton = await page.$(
    'form[name="as_form"] input[type="submit"]',
  );
  await submitButton?.click();

  // screenshot results page for now
  await page.waitFor(checkSearchResults);

  // page with results has been loaded
  // grab the results from the table (this includes any inner html objects)
  // extract the id of the result with a regex expression and append the
  // id to the list on match
  const searchResultIDs: string[] = await page.evaluate(() => {
    const linkIDRegex = /([0-9]+)<\/a>$/g;
    const searchResultsList = document.getElementById('search_results')?.children;
    const results: string[] = [];
    if (searchResultsList !== undefined) {
      for (let i = 0; i < searchResultsList?.length; i += 1) {
        const title = searchResultsList[i].children[0].innerHTML;
        const id = title.match(linkIDRegex);

        if (id !== null) {
          results.push(id[0].replace(/<\/a>/, ''));
        }
      }
    }
    return results;
  });
  // close the browser
  await browser.close();
  // return the list of pages to scrape from
  return { results: searchResultIDs };
};

export default promedURLResultIDs;
