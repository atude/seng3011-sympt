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
  // const user: ApiUser = await verifyUser(req.headers.authorization);
  const user: ApiUser = await verifyUser("eyJhbGciOiJSUzI1NiIsImtpZCI6IjFmODhiODE0MjljYzQ1MWEzMzVjMmY1Y2RiM2RmYjM0ZWIzYmJjN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc3ltcHQtMTI1OWUiLCJhdWQiOiJzeW1wdC0xMjU5ZSIsImF1dGhfdGltZSI6MTU4NDcwNDg5MCwidXNlcl9pZCI6Im1MYW5iNGJiVWZXZUJIcW1DQndZNDc2WjdrcjEiLCJzdWIiOiJtTGFuYjRiYlVmV2VCSHFtQ0J3WTQ3Nlo3a3IxIiwiaWF0IjoxNTg0NzgzNDg3LCJleHAiOjE1ODQ3ODcwODcsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.iHgOh4E54SED8rUecQvpeSLt14BI2YhEXEAXWrUWoKiA0dnfcBhTPQ6or5W8n7gDD5k5ck9fpRFnWmhq4iH3gdMc0_t-6OJvlN_2YwqwpjMOOWcfCuVWD_yrEeU9s4brFmvInGvZ5L6Exdp0Wf24-31lwrVYgnerlBDEg7mn4hClg6OpEDfTo_cDE1aaoJuDFIkaISBXNLaKe57glqojmWAob4pMK9ntfbOb_bYjBG1QE_d3EizNcwiWEb4aF7-Sa1b7nCr28mY1FzQ8GtCaJhWxEBhhcF0vYCtmPS7JxP799-KkY1kLouHATa1MTMdF37mV65_DC4TUqGQf09iqqw");
  const timestamp: string = (new Date().getTime() / 1000).toFixed(0).toString();

  if (user.authenticated) {
    console.log(user);
    const metadata = getMetadata();
    const articles = await getArticles(req.query);
    const log: ApiLog = {
      timestamp,
      success: !isError(articles),
      query: req.originalUrl,
      error: isError(articles) ? articles : null,
    };

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
      "Token may be invalid or expired",
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

app.listen(port, '0.0.0.0', () => console.log(`--> Server is listening on ${port}`));

// Populate db every 12 hrs
setInterval(() => {
  console.log("Start generic scrape from yesterday's posts...");
  populateDb();
}, 1000 * 60 * 60 * 12);
