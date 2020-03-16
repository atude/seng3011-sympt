/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import worldCitiesList from '../constants/worldCitiesList.json';
import { Location } from '../types';
import { getArticlesForceScrape } from '../queryController';

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

  const queryUrls: string[] = allCountries.map((country: string) => {
    const queryUrl: string = `
      ?startdate=${monthAgoDate}
      &enddate=${nowDate}
      &location=${country.toLowerCase().replace(/ /g, "%20")}
    `.replace(/\s/g, '');
    return queryUrl;
  });

  const printUrls = async () => {
    for (const url of queryUrls) {
      console.log(url);
      await getArticlesForceScrape(url);
    }
  };
  printUrls();
};

export default populateDb;
