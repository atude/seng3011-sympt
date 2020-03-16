import express from 'express';
import admin from './firebase/firebaseInit';
import { getArticlesForceScrape, getArticles } from './queryController';
import populateDb from './services/dbPopulationService';

const app = express();
const port: number = Number(process.env.PORT) || 4000;
console.log(`Admin init: ${!!admin}`);

// Populate db every 12 hrs and on deploy
setInterval(() => populateDb(), 1000 * 60 * 60 * 12);

/* Example query */
// ?keyterms=coronavirus
// &startdate=2019-12-01T00:00:00
// &enddate=2020-02-01T00:00:00
// &location=china

app.get('/articles/', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.send(await getArticles(req.query));
});

app.get('/articles-force/', async (req, res) => {  
  res.header("Access-Control-Allow-Origin", "*");
  res.send(await getArticlesForceScrape(req.query));
});

app.listen(port, '0.0.0.0', () => console.log(`--> Server is listening on ${port}`));
