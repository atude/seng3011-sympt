import { PageObject } from '../types';

const headerValues: string[] = [
  "Published Date: ", 
  "Subject: ", 
  "Archive Number: ",
];

const getJSONResults = async (
  id: string, 
  browserInstance: any,
): Promise<PageObject[] | undefined> => {
  const JSONResults: PageObject[] = [];
  const pageObject: PageObject = {
    url: `https://promedmail.org/promed-post/?id=${id}`, 
    date_of_publication: '',
    headline: '',
    main_text: '',
    reports: [],
  };

  const page = await browserInstance.newPage();
  await page.goto(pageObject.url, { waitUntil: 'networkidle2' });

  // Process header data and main content data
  try {
    await page.waitForFunction('document.getElementsByClassName("publish_date_html").length > 0');
    const headerDataRaw: string = await page.evaluate(() => document.getElementsByClassName('publish_date_html')[0].innerHTML);
    
    await page.waitForFunction('document.getElementsByClassName("text1").length > 0');
    const mainContentData: string = await page.evaluate(() => document.getElementsByClassName('text1')[0].innerHTML);

    // Filter out html tags and parse content manually
    const headerDataFiltered = headerDataRaw
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .split(/(Published Date: )|(Subject: )|(Archive Number: )/)
      .filter((element) => !!element && !headerValues.includes(element));

    pageObject.date_of_publication = headerDataFiltered[0].trim();
    pageObject.headline = headerDataFiltered[1].split(" ").slice(1).join(" ").trim();

    // TODO: Filter out content properly into sections for mainText
    pageObject.main_text = mainContentData
      .replace(/<a.*?>/g, ' ')
      .replace(/<\/a>/g, ' ')
      .replace(/(<br>){1,3}/g, ' ')
      .replace(/<.*?>/g, ' ')
      // .replace(/"/g, '') quotes in the text are escaped. unsure at this point whether we need to 
      // remove this or if it will be handled automatically.
      .replace(/&.*?;/g, '');

    JSONResults.push(pageObject);
  } catch (error) {
    console.error(`Failed to get data for page ${pageObject.url}`);
  }
 
  await page.close();
  return JSONResults;
};

export default getJSONResults;
