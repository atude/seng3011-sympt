import express from 'express';
import admin from './firebase/firebaseInit';
// import diseaseList from './constants/diseaseList.json';
import queryScrapePosts from './queryController';

const app = express();
const port: number = Number(process.env.PORT) || 4000;
console.log(`Admin init: ${!!admin}`);

// function scrapePromed(i: number) {
//   setTimeout(async () => {
//     const searchDisease: string = diseaseList[i].name.split(' ').join(' AND ');
//     console.log(`searching on terms: ${searchDisease}`);
//     // the query url is start/end date and location agnostic only taking the most recent results
//     const queryURL: string = `?keyterms=${searchDisease}`;
//     const results: Promise<any> = await firestoreScrapedPosts(queryURL);
//     console.log(results); // debugging print statement
//     // ****************************************************************
//     // insert firestore connection and population here based on results
//     // ****************************************************************
//   }, 120 * 1000 * i);
// }

const exampleQuery = '?keyterms=coronavirus&startdate=2019-12-01T00:00:00&enddate=2020-02-01T00:00:00&location=china';

app.get('/', async (req, res) => {
  // setInterval(() => {
  //   for (let i: number = 0; i < diseaseList.length; i++) {
  //     scrapePromed(i);
  //   }
  // }, 60 * 60 * 12 * 1000); // run every 12 hours

  res.send(await queryScrapePosts(exampleQuery));
});

app.listen(port, '0.0.0.0', () => console.log(`--> Server is listening on ${port}`));
