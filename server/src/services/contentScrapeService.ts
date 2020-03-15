import { PageObject, Location, Report } from '../types';
import diseaseList from '../constants/diseaseList.json';
import { formatDateToExact, dateRegexWords } from '../utils/formatters';
import worldCitiesList from '../constants/worldCitiesList.json';
import syndromeList from '../constants/syndromeList.json';

const headerValues: string[] = [
  "Published Date: ", 
  "Subject: ", 
  "Archive Number: ",
];

const minSentenceLength: number = 70;

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

    const syndromes: string[] = [];
    filteredMainText.split('. ').forEach((sentence) => {
      for (let i = 0; i < syndromeList.length; i++) {
        let syndromeCount = 0;
        const syndromeLength = syndromeList[i].name.split(' ').length;
        syndromeList[i].name.split(' ').forEach((syndrome) => {
          if (sentence.toLowerCase().includes(syndrome.toLowerCase())) {
            syndromeCount++;
          }
        });
        if (syndromeCount >= syndromeLength / 2 && !syndromes.includes(syndromeList[i].name)) {
          syndromes.push(syndromeList[i].name);
        }
      }
    });

    /* Filter for locations */
    const locations: Location[] = [];
    filteredMainText.split('. ').forEach((sentence) => {
      worldCitiesList.forEach((city: Location) => {
        if (
          sentence.includes(city.country) && 
          sentence.includes(city.location) && 
          city.country !== city.location
        ) {
          if (locations.indexOf(city) === -1) {
            locations.push(city);
          }
        }
      });
    });

    /* Filter for report dates */
    // TODO: error checking and fill missing date sections if possible
    const foundDates = 
      filteredMainText
        .match(dateRegexWords)
        ?.map((dateStr: string) => formatDateToExact(dateStr))
        .sort();

    const uniqueDates = [...new Set(foundDates)];
    const filteredDates: string = 
      uniqueDates[0] ? 
        (uniqueDates.length <= 1 ? 
          `${uniqueDates[0]} xx:xx:xx` : 
          `${uniqueDates[0]} xx:xx:xx to ${uniqueDates[uniqueDates.length - 1]} xx:xx:xx` 
        ) : "xx:xx:xx xx:xx:xx";

    const reportData: Report = {
      diseases: foundDiseases.length ? foundDiseases : ["unknown"],
      locations: locations.length ? locations : [],
      event_date: filteredDates,
      syndromes,
    };

    const parsedPageData: PageObject = {
      id,
      url: urlData, 
      date_of_publication: dateData,
      headline: headlineData,
      main_text: filteredMainText,
      reports: [reportData],
    };
 
    await page.close();
    return parsedPageData;
  } catch (error) {
    await page.close();
    console.log(`! Failed to get page data on ${urlData}. Skipping...`);
    console.log(`Reason: ${error.message}`);
    return { id: null };
  }
};

export default contentScraper;
