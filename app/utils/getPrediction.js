// * Inspired by SIR model for spread of Disease - The Differential Equation Model 
// * https://www.maa.org/press/periodicals/loci/joma/the-sir-model-for-spread-of-disease-the-differential-equation-model
/* Differential equations
 * ds/dt = -b*s(t)*i(t)
 * di/dt = b*s(t)*i(t) - k*i(t)
 * dr/dt = k*i(t)
 */
// Some constants and assumptions
// const population = 24600000;
// const population = 1421000;

import { getDaysFromSimpleDate } from "./dateFunctions";

// * Final Daily Contacts constant, most severe rate of transmission in Australia
const dailyContacts = 1 / 8;

// The 'b' variable is reduced when the public is practicing social distancing
// * Final Daily Contacts constant with social distancing
const dailyContactsDistancing = 1 / 25;
// Average recovery period 'k' is 2 weeks for mild cases, and 3-6 weeks for sever cases
// One recovery every 21 days
const recovery = 1 / 21;

// Will return an array of nCases, with t (days) as the index
// t will be from current time, e.g. t=0 is current day, t=1 is tomorrow

// * Scrapping function, puppeteer returning error, fix if possible
// (async () => {
//     let url = "https://www.worldometers.info/coronavirus/country/australia/";

//     let browser = await puppeteer.launch({args: ['--no-sandbox --disable-setuid-sandbox']});
//     let page = await browser.newPage();

//     await page.goto(url, { waitUntil: 'networkidle2' });

//     for (let i = 0; i < averageSize; i++) {
//         let date_ob = new Date();
//         if (date_ob.getDate() > 0) {
//             let date = "newsdate" + date_ob.getFullYear().toString() + "-" + ("0" + (date_ob.getMonth() + 1).toString()) + "-" + (date_ob.getDate() - i).toString();
//             let data = await page.evaluate(() => {
//                 let newCase = /[0-9]+/.exec(document.querySelector('div[id="' + date + '"] > div > div > ul > li > strong').innerText)[0];
//                 return newCase;
//             });
//             newCases.push(data);
//         }
//     }

//     console.log(newCases);
//     debugger;

//     await browser.close();

// })();

export const computePrediction = (day, currCases, recovered, population, socialDistancing) => {
  let it0 = currCases / population;
  let rt0 = recovered / population;
  let st0 = (population - (currCases + recovered)) / population;

  let contacts = dailyContacts;    
  if (socialDistancing) {
    contacts = dailyContactsDistancing;
  }

  const nCases = new Array(day);
  let currSt;
  let currIt;
  let currRt;

  for (let i = 0; i <= day; i++) {
    currSt = -contacts * st0 * it0;
    currIt = -currSt - recovery * it0;
    currRt = recovery * it0;

    st0 += currSt;
    it0 += currIt;
    rt0 += currRt;

    nCases.push([st0 * population, it0 * population, rt0 * population]);
  }
    
  return nCases;
};

// This is the less reliable function of the two
// Prefferred to use the function considering the recovered population
export const computePredictionNoRecovery = (day, currCases, population, socialDistancing) => {
  let it0 = currCases / population;
  let rt0 = 0;        // This is the difference between the two functions
  let st0 = (population - (currCases + 1)) / population;

  let contacts = dailyContacts;
  if (socialDistancing) {
    contacts = dailyContactsDistancing;
  }

  let nCases = [];
  let currSt;
  let currIt;
  let currRt;

  for (let i = 0; i <= day; i++) {
    currSt = -contacts * st0 * it0;
    currIt = -currSt - recovery * it0;
    currRt = recovery * it0;

    st0 += currSt;
    it0 += currIt;
    rt0 += currRt;

    nCases.push([st0 * population, it0 * population, rt0 * population]);
  }
    
  return nCases;
};

export const generatePredictions = (days, casesArray, population) => {
  const latestDataObject = casesArray[casesArray.length - 1];
  const latestCases = latestDataObject.Number;
  const latestDate = latestDataObject.Date;
  const postcode = latestDataObject.POA_NAME16;

  const rawPredictionsDistancing = computePredictionNoRecovery(days - 1, latestCases, population, true);
  const rawPredictions = computePredictionNoRecovery(days - 1, latestCases, population, false);

  const predictionsTotal = rawPredictions.map((predictionSet) => {
    return Math.round(population - predictionSet[0]);
  });

  const predictionsDistancingTotal = rawPredictionsDistancing.map((predictionSet) => {
    return Math.round(population - predictionSet[0]);
  });

  const compiledPredictions = predictionsTotal.map((prediction, i) => {
    const predictionDistancing = predictionsDistancingTotal[i];

    return {
      Date: getDaysFromSimpleDate(latestDate, i + 1),
      Number: prediction,
      NumberDistancing: predictionDistancing,
      POA_NAME16: postcode,
    };
  });

  return [...casesArray, ...compiledPredictions];
};

export const generatePredictionsState = (months, latestCases, statePopulation) => {
  const assumeDaysInMonth = 20;
  const rawPredictionsDistancing = computePredictionNoRecovery(months * assumeDaysInMonth, latestCases, statePopulation, true);
  
  let lastCase = latestCases;
  const predictionsDistancingTotal = rawPredictionsDistancing.map((predictionSet) => {
    const prediction = Math.round(statePopulation - predictionSet[0]) - lastCase;
    lastCase = prediction;
    return prediction;
  }).filter((prediction, i) => i % assumeDaysInMonth === 0);

  console.log(predictionsDistancingTotal);

  return predictionsDistancingTotal;
};
