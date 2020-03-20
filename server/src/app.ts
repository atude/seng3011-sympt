import express from 'express';
import admin from './firebase/firebaseInit';
import { getArticles } from './queryController';
import populateDb from './services/dbPopulationService';
import { checkAuthenticated } from './services/firebaseService';
import generateError from './utils/generateError';
import getMetadata from './utils/getMetadata';
import { isError } from './utils/checkFunctions';

const app = express();
const port: number = Number(process.env.PORT) || 4000;
console.log(`Admin init: ${!!admin}`);

/* Example query */
// ?keyterms=coronavirus
// &startdate=2019-12-01T00:00:00
// &enddate=2020-02-01T00:00:00
// &location=china

app.all('/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/articles/', async (req, res) => {
  const authenticated = await checkAuthenticated(req.headers.authorization);
  if (authenticated) {
    const metadata = getMetadata();
    const articles = await getArticles(req.query);
    if (isError(articles)) {
      res.send(articles);
    } else {
      res.send({ metadata, articles });
    }
  } else {
    res.status(401).send(generateError(401, "Bad Authentication", "Failed to verify authentication token"));
  }
});

app.listen(port, '0.0.0.0', () => console.log(`--> Server is listening on ${port}`));

// Populate db every 12 hrs and on deploy
console.log("Start generic scrape from yesterday's posts...");
populateDb();
setInterval(() => populateDb(), 1000 * 60 * 60 * 12);
