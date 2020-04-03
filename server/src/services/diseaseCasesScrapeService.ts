import puppeteer from 'puppeteer';
import puppeteerConfig from '../constants/puppeteerConfig';
import { getUTCDateBasic } from '../utils/formatters';
import { casesRef } from '../firebase/collectionReferences';

const areas = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA", "AUS", "AUSYTD"];

const scrapeDiseasesStats = async (
  setDate: Date,
): Promise<any> => {
  const browserInstance = await puppeteer.launch(puppeteerConfig);
  const nndssLink = "http://www9.health.gov.au/cda/source/rpt_1_sel.cfm";
  const page = await browserInstance.newPage();
  await page.goto(nndssLink, { waitUntil: 'networkidle0' });

  try {
    // Setup and click first page
    await page.click("input#REPORT_TYPE_b");
    await page.waitFor(2000);
    await page.select("select#Sel_Month.input-large", (setDate.getUTCMonth() + 1).toString());
    await page.select("select#Sel_Year.input-small", setDate.getUTCFullYear().toString());
    await page.click("button#submit.btn.btn-primary");

    // New table page
    await page.waitForSelector("tbody");

    // Get all fields
    const rawTableFields = await page.$$eval(
      "table.table-bordered.table-condensed.table-wrapper",
      (trs) => trs.map((tr) => {
        const tds = [...tr.getElementsByTagName('td')];
        return tds.map((td) => td.textContent);
      }),
    );

    await page.close();

    const casesObj: {[k: string]: any} = {};
    let i: number = 0;
    let currField: string = "";

    // Convert raw array into usable object
    rawTableFields[0].forEach((field: string | null) => {
      if (field !== null) {
        const fieldFormatted = field
          .toLowerCase()
          .split(" ")
          .join("-")
          .split("/")
          .join("+");

        if (i === 0) {
          // Heading field
          casesObj[fieldFormatted] = {};
          currField = fieldFormatted;
        } else {
          casesObj[currField][areas[i - 1]] = fieldFormatted;
        }

        if (i === 10) {
          i = 0;
        } else {
          i++;
        }
      }
    });

    const setDateFormatted: string = getUTCDateBasic(setDate);

    // Write to firestore
    Object.keys(casesObj).forEach(async (keyDisease: string) => {
      Object.keys(casesObj[keyDisease]).forEach(async (keyArea: string) => {
        await casesRef.doc(keyDisease).collection("cases").doc(keyArea).set({
          [setDateFormatted]: Number(casesObj[keyDisease][keyArea]) || 0,
        }, { merge: true });
      });
    });
    
    return casesObj;
  } catch (error) {
    return error;
  } finally {
    await browserInstance.close();
  }
};

export default scrapeDiseasesStats;
