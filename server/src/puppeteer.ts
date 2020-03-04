const puppeteer = require('puppeteer');

// check that the submit buttons have loaded into the page
function checkSubmitButton() {
  return document.getElementsByName('submit') != null;
}

// check that the child elemnts of the search results div is not empty (1 if no results)
function checkSearchResults() {
  return document.getElementById('search_results')?.childElementCount !== 0;
}

// takes a url query string of the form
// ?keyterms=something[,somethingelse,hi]&startdate=yyyy:mm:ddTHH:MM:
// SS&enddate=yyyy:mm:ddTHH:MM:SS&location=somewhere
// return nothing but saves the results in test.png screenshot
const promedURLResults = async (urlSearchQueries: string) => {
  const urlParams = new URLSearchParams(urlSearchQueries);
  const keyTerms = urlParams.get('keyterms');
  const startDate = urlParams.get('startdate');
  const endDate = urlParams.get('enddate');
  const location = urlParams.get('location');

  if (
    startDate == null
    || endDate == null
    || location == null
    || keyTerms == null
  ) {
    // lol fix this later
    return 'Incorrect api request';
  }

  // join the listed keywords together separated by ' AND '
  // with the location on the end of the key terms
  const formattedKeyTerms: string = `${keyTerms?.split(',').join(' AND ')} AND ${location}`;

  // date regex with groups
  const dateRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2}).*/;

  // compare the startdate submitted with the regex
  // --> no error checking at this time
  const startDateGroups = startDate.match(dateRegex);
  let startYear: string = '';
  let startMonth: string = '';
  let startDay: string = '';
  if (startDateGroups != null) {
    [, startYear, startMonth, startDay] = startDateGroups;
  }
  // format date ready for input into promed
  const formattedStartDate = `${startMonth}/${startDay}/${startYear}`;

  // compare the enddate submitted with the regex
  // --> no error checking at this time
  const endDateGroups = endDate.match(dateRegex);
  let endYear: string = '';
  let endMonth: string = '';
  let endDay: string = '';
  if (endDateGroups != null) {
    [, endYear, endMonth, endDay] = endDateGroups;
  }
  // format date ready for input into promed
  const formattedEndDate = `${endMonth}/${endDay}/${endYear}`;

  // format data
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 },
  });
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

  // click on the search button
  await page.waitFor(checkSubmitButton);
  const submitButton = await page.$(
    'form[name="as_form"] input[type="submit"]',
  );
  await submitButton.click();

  // screenshot results page for now
  await page.waitFor(checkSearchResults);
  await page.screenshot({ path: 'test.png' });

  // close the browser
  await browser.close();

  return 'completed';
};

export default promedURLResults;
