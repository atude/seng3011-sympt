import { getArticlesForceScrape } from '../queryController';

// Populates db with general results from a day ago
const populateDb = async () => {
  const nowDate: string = new Date().toISOString();
  const getDayAgoDate = () => {
    const date: Date = new Date();
    date.setHours(date.getHours() - 24);
    return date.toISOString();
  };
  const dayAgoDate: string = getDayAgoDate();

  /* General search */
  const queryUrl: string = `
    ?startdate=${dayAgoDate}
    &enddate=${nowDate}
    &location=${""}
  `.replace(/\s/g, ''); 

  console.log(queryUrl);
  await getArticlesForceScrape(queryUrl);
};

export default populateDb;
