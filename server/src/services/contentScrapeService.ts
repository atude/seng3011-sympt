import { PageObject, Location } from '../types';
import diseaseList from '../constants/diseaseList.json';
import { dateRegex, formatDateToExact } from '../utils/formatters';
import worldCitiesList from '../constants/worldCitiesList.json';

const headerValues: string[] = [
  "Published Date: ", 
  "Subject: ", 
  "Archive Number: ",
];

const minSentenceLength: number = 70;
const maxParagraphCount: number = 5;

const contentScraper = async (
  id: string, 
  browserInstance: any,
): Promise<PageObject> => {
  const urlData: string = `https://promedmail.org/promed-post/?id=${id}`;
  const page = await browserInstance.newPage();
  await page.goto(urlData, { waitUntil: 'networkidle2', timeout: 150000 });

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
      .replace(/&.*?;/g, '')
      .split("<br><br>");

    /* Filter for main text */

    let isStartedContent: boolean = false;
    const filteredMainText: string = mainTextDataChunks.map((chunk) => {
      if (isStartedContent) {
        return chunk;
      }  
      if (chunk.substr(0, 4) !== "<br>") {
        return "";
      } 

      // Important info starts at first <br> after filtering
      isStartedContent = true;
      return chunk.substr(4);
    })
      // Filter empty sentences
      .filter((chunk) => chunk !== "")
      .map((chunk) => {
        const filteredChunk: string[] = chunk.split("<br>");
        return filteredChunk[filteredChunk.length - 1];
      })
      // Avoid random fragments
      .filter((chunk) => chunk.length > minSentenceLength)
      .slice(0, maxParagraphCount)
      .join(" ");

    if (!filteredMainText) {
      throw new Error("Failed to find sufficient data in body text.");
    }

    /* Filter for report diseases */
    const foundDiseases: string[] = [];
    diseaseList.forEach((disease: { name: string }) => {
      if (filteredMainText.includes(disease.name)) {
        foundDiseases.push(disease.name);
      }
    });

    /* Filter for report dates */
    // TODO: error checking and fill missing date sections if possible
    const foundDates = 
      filteredMainText
        .match(dateRegex)
        ?.map((dateStr: string) => formatDateToExact(dateStr))
        .sort();

    const uniqueDates = [...new Set(foundDates)];
    const filteredDates: string = 
      uniqueDates[0] ? 
        (uniqueDates.length <= 1 ? 
          `${uniqueDates[0]} xx:xx:xx` : 
          `${uniqueDates[0]} xx:xx:xx to ${uniqueDates[uniqueDates.length - 1]} xx:xx:xx` 
        ) : "xx:xx:xx xx:xx:xx";

    const locations: Location[] = [];
    filteredMainText.split('. ').forEach((sentence) => {
      for (let i = 0; i < worldCitiesList.length; i++) {
        const country: string = worldCitiesList[i].country;
        const location: string = worldCitiesList[i].name;
        if (sentence.includes(country) && sentence.includes(location) && country !== location) {
          const locationObj: Location = { country, location };
          locations.push(locationObj);
        }
      }
    });

    const parsedPageData: PageObject = {
      id,
      url: urlData, 
      date_of_publication: dateData,
      headline: headlineData,
      main_text: filteredMainText,
      reports: {
        diseases: foundDiseases.length ? foundDiseases : ["unknown"],
        event_date: filteredDates,
        locations: locations.length ? locations : [],
      },
    };
 
    await page.close();
    return parsedPageData;
  } catch (error) {
    await page.close();
    console.error(`Failed to get data for page ${urlData}. Skipping this page...`);
    console.error(error);
    return { id: null };
  }
};

export default contentScraper;
