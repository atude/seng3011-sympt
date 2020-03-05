import * as puppeteer from 'puppeteer';
import { PageObject } from './types';

const getJSONResults = async (id: string): Promise<PageObject[]> => {
  const JSONResults: PageObject[] = [];
  const browser = await puppeteer.launch();
  const pageObject: PageObject = {
    url: '', 
    date_of_publication: '',
    headline: '',
    main_text: '',
    reports: [],
  };

  const page = await browser.newPage();
  await page.goto(`https://promedmail.org/promed-post/?id=${id}`, {
    waitUntil: 'networkidle2',
  });

  pageObject.url = `https://promedmail.org/promed-post/?id=${id}`;

  // Process header data
  await page.waitForFunction('document.getElementsByClassName("publish_date_html").length > 0');
  const headerData: string[] = await page.evaluate(() => {
    const headerValues: string[] = ["Published Date: ", "Subject: ", "Archive Number: "];

    return document.getElementsByClassName('publish_date_html')[0].innerHTML
      // filter out html tags and parse content manually
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .split(/(Published Date: )|(Subject: )|(Archive Number: )/)
      // filter out null values
      .filter((element) => !!element && !headerValues.includes(element));
  });

  // Process main content/reports
  await page.waitForFunction('document.getElementsByClassName("text1").length > 0');
  const mainContentData: string = await page.evaluate(() => document.getElementsByClassName('text1')[0].innerHTML);
  // TODO: Filter out content properly into sections for mainText

  // Format and cut out due to weird Promed formatting
  pageObject.date_of_publication = headerData[0].trim();
  pageObject.headline = headerData[1].split(" ").slice(1).join(" ").trim();
  pageObject.main_text = mainContentData;

  JSONResults.push(pageObject);

  await browser.close();
  return JSONResults;
};

export default getJSONResults;
