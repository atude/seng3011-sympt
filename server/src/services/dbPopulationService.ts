/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import diseaseList from '../constants/diseaseList.json';
import worldCitiesList from '../constants/worldCitiesList.json';
import { Location } from '../types';
import { getArticlesForceScrape } from '../queryController';

const flatten = (arr: any[]): any => arr.reduce((flat: string | any[], toFlatten: any): any => 
  flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
  
// const sleep = (m: number) => new Promise((r) => setTimeout(r, m));

const populateDb = async () => {
  const nowDate: string = new Date().toISOString();
  const getMonthAgoDate = () => {
    const date: Date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString();
  };
  const monthAgoDate: string = getMonthAgoDate();
  
  const allCountries: string[] = 
    worldCitiesList.map((city: Location) => city.country).filter(
      (country: string, i: number, arr: string[]) => country !== "" && arr.indexOf(country) === i,
    );

  const allQueryUrls: string[][] = diseaseList.map((disease: { name: string }) => {
    const queryChunk: string[] = allCountries.map((country: string) => {
      const queryUrl: string = `
        ?keyterms=${disease.name.replace(/ /g, "%20")}
        &startdate=${monthAgoDate}
        &enddate=${nowDate}
        &location=${country.toLowerCase().replace(/ /g, "%20")}
      `.replace(/\s/g, '');
      return queryUrl;
    });

    return queryChunk;
  });
  const flattenedUrls: string[] = flatten(allQueryUrls);

  const printUrls = async () => {
    for (const url of flattenedUrls.splice(10)) {
      console.log(url);
      await getArticlesForceScrape(url);
    }
  };
  printUrls();
  // flattenedUrls.forEach(async (queryUrl: string) => {
    
  //   // await getArticlesForceScrape(queryUrl);
  // });
  // const searchDisease: string = diseaseList[i].name.split(' ').join(' AND ');
  // console.log(`searching on terms: ${searchDisease}`);
  // const queryURL: string = `?keyterms=${searchDisease}`;
  // await getArticlesForceScrape(queryURL);
};

export default populateDb;
