import { PageObject } from '../types';
import diseaseList from '../constants/diseaseList.json';

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

    const mainTextDataChunks: string[] = mainContentData
      .replace(/<a.*?>/g, ' ')
      .replace(/<\/a>/g, ' ')
      // .replace(/(<br>){1,3}/g, ' ')
      // .replace(/<.*?>/g, ' ')
      // .replace(/"/g, '')
      .replace(/&.*?;/g, '')
      .split("<br><br>");

    /* Filter for main text */
    const minSentenceLength: number = 70;
    let paragraphCount: number = 5;
    let isStartedContent: boolean = false;

    const filteredMainText: string = mainTextDataChunks.map((chunk) => {
      if (isStartedContent) {
        if (paragraphCount !== 0) {
          paragraphCount--;
          return chunk;
        } 
      } else { 
        if (chunk.substr(0, 4) !== "<br>") {
          return "";
        } 

        // Important info starts at first <br> after filtering
        isStartedContent = true;
        return chunk.substr(4);
      }

      return "";
    })
      // Filter empty sentences
      .filter((chunk) => chunk !== "")
      .map((chunk) => {
        const filteredChunk: string[] = chunk.split("<br>");
        return filteredChunk[filteredChunk.length - 1];
      })
      // Avoid random fragments
      .filter((chunk) => chunk.length > minSentenceLength)
      .join(" ");

    if (!filteredMainText) {
      throw new Error("Failed to find sufficient data in body text.");
    }

    /* Filter for report */
    const foundDiseases: string[] = [];
    diseaseList.forEach((disease: { name: string }) => {
      if (filteredMainText.includes(disease.name)) {
        foundDiseases.push(disease.name);
      }
    });

    const parsedPageData: PageObject = {
      url: urlData, 
      date_of_publication: dateData,
      headline: headlineData,
      main_text: filteredMainText,
      reports: {
        diseases: foundDiseases.length ? foundDiseases : ["unknown"],
      },
    };
 
    await page.close();
    return parsedPageData;
  } catch (error) {
    console.error(`Failed to get data for page ${urlData}`);
    console.error(error);
    return undefined;
  }
};

export default contentScraper;
