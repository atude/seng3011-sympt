import { PageObject, Report } from '../types';

const headerValues: string[] = [
  "Published Date: ", 
  "Subject: ", 
  "Archive Number: ",
];

const contentScraper = async (
  id: string, 
  browserInstance: any,
): Promise<PageObject | undefined> => {
  const urlData: string = `https://promedmail.org/promed-post/?id=${id}`;
  const page = await browserInstance.newPage();
  await page.goto(urlData, { waitUntil: 'networkidle2' });

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

    const dateData = headerDataFiltered[0].trim();
    const headlineData = headerDataFiltered[1].split(" ").slice(1).join(" ").trim();

    const mainTextData = mainContentData
      .replace(/<a.*?>/g, ' ')
      .replace(/<\/a>/g, ' ')
      .replace(/(<br>){1,3}/g, ' ')
      .replace(/<.*?>/g, ' ')
      // .replace(/"/g, '') quotes in the text are escaped. unsure at this point whether we need to 
      // remove this or if it will be handled automatically.
      .replace(/&.*?;/g, '');

    
    const reportsData: Report = {
      diseases: mainTextData.split(' ****** ').slice(1),
    };

    const parsedPageData: PageObject = {
      url: urlData, 
      date_of_publication: dateData,
      headline: headlineData,
      main_text: mainTextData,
      reports: reportsData,
    };
 
    await page.close();
    return parsedPageData;
  } catch (error) {
    console.error(`Failed to get data for page ${urlData}`);
    return undefined;
  }
};

export default contentScraper;
