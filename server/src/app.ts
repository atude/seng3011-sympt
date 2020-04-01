import express from 'express';
import admin from './firebase/firebaseInit';
import { getArticles } from './queryController';
import populateDb from './services/dbPopulationService';
import { verifyUser } from './services/firebaseService';
import generateError from './utils/generateError';
import getMetadata from './utils/getMetadata';
import { isError } from './utils/checkFunctions';
import { ApiUser, ApiLog } from './types';
import { addLog } from './services/devAccountService';

// delete when no longer testing
import { dummyNewsData } from './constants/dummyNewsData';
import hashString from './utils/hashString';

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
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization");
  next();
});

app.get('/articles/', async (req, res) => {
  const user: ApiUser = await verifyUser(req.headers.authorization);
  const timestamp: string = (new Date().getTime() / 1000).toFixed(0).toString();

  if (user.authenticated) {
    const articles = await getArticles(req.query);
    const log: ApiLog = {
      timestamp,
      success: !isError(articles),
      query: req.originalUrl,
      error: isError(articles) ? articles : null,
    };

    let metadata = null;
    if (!isError(articles)) {
      metadata = getMetadata(articles.length, user.email);
    } else {
      metadata = getMetadata(0, user.email);
    }

    await addLog(user, log);
    if (isError(articles)) {
      res.send(articles);
    } else {
      res.send({ metadata, articles });
    }
  } else {
    const error = generateError(
      401, 
      "Invalid authentication token", 
      "Could not match token with user",
    );
    await addLog(user, {
      timestamp,
      success: false,
      query: req.originalUrl,
      error,
    });
    res.status(401).send(error);
  }
});

// const NewsAPI = require('newsapi');

app.get('/_news/', async (req, res) => {
  console.log('_news called');
  /*
  const searchQueries = new URLSearchParams(req.query);
  const queryDiseases = searchQueries.get('diseases');
  let searchDiseases = queryDiseases?.split(',').join(' OR ');
  if (!searchDiseases) {
    searchDiseases = '';
  }
  const newsapi = new NewsAPI('00ec351a3f24432190a40b594fc6f352');
  const newsArticles = await newsapi.v2.everything({
    q: searchDiseases,
    domains: 'nytimes.com,wsj.com, washingtonpost.com, bbc.com, economist.com, newyorker.com, 
      ap.org, reuters.com, bloomberg.com, foreignaffairs.com, theatlantic.com, abc.net, 
      cbsnews.com',
    from: '2020-03-01',
    to: '2020-03-30',
    language: 'en',
    sortBy: 'publishedAt',
  });
  res.send(newsArticles);
  */
  const articleSet = new Set();
  dummyNewsData.articles = dummyNewsData.articles.filter((article) => {
    const hashedArticle = hashString(article.content.slice(0, 100));
    if (articleSet.has(hashedArticle)) {
      return false;
    } 
    articleSet.add(hashedArticle);
    return true;
  });
  res.send(dummyNewsData);
});

app.get('/_twitter/', async (req, res) => {
// todo
});


app.listen(port, '0.0.0.0', () => console.log(`--> Server is listening on ${port}`));

// Populate db every 12 hrs
setInterval(() => {
  console.log("Start generic scrape from yesterday's posts...");
  populateDb();
}, 1000 * 60 * 60 * 12);
