interface PageObject {
  url: string,
  // eslint-disable-next-line camelcase
  date_of_publication: string,
  headline: string,
  // eslint-disable-next-line camelcase
  main_text: string,
  reports: [],
}

const puppeteer = require('puppeteer');

const getJSONResults = async (id: string) => {
  // object to contain all results
  const JSONResults: PageObject[] = [];

  // format data
  const browser = await puppeteer.launch();

  // populate the json array for each link
  const pageObject: PageObject = {
    url: '', date_of_publication: '', headline: '', main_text: '', reports: [],
  };
  const page = await browser.newPage();
  await page.goto(`https://promedmail.org/promed-post/?id=${id}`, {
    waitUntil: 'networkidle2',
  });
  pageObject.url = `https://promedmail.org/promed-post/?id=${id}`;
  // wait for page to load the publish information
  await page.waitForSelector('.publish_data_html');

  // assign below to a const later
  const publishDate = await page.evaluate(() => {
    // const dateRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    const publishSection = document.getElementsByClassName('publish_date_html')[0].children[0].innerHTML;
    return publishSection;
  });

  pageObject.date_of_publication = publishDate;

  JSONResults.push(pageObject);

  // close the browser
  await browser.close();
  return JSONResults;
};

export default getJSONResults;
