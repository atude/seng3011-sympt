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
import { getNormalisedDate } from './utils/formatters';

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
  const user: ApiUser = await verifyUser("eyJhbGciOiJSUzI1NiIsImtpZCI6IjFmODhiODE0MjljYzQ1MWEzMzVjMmY1Y2RiM2RmYjM0ZWIzYmJjN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc3ltcHQtMTI1OWUiLCJhdWQiOiJzeW1wdC0xMjU5ZSIsImF1dGhfdGltZSI6MTU4NDcwNDg5MCwidXNlcl9pZCI6Im1MYW5iNGJiVWZXZUJIcW1DQndZNDc2WjdrcjEiLCJzdWIiOiJtTGFuYjRiYlVmV2VCSHFtQ0J3WTQ3Nlo3a3IxIiwiaWF0IjoxNTg0Nzc0ODI3LCJleHAiOjE1ODQ3Nzg0MjcsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.fAqRI59Z7rRfwYV5xAvDI4mfycEl2MNh7R76M3prqvfaHhdkVLoEawpDeeKWe_jNpF3P-O4XvB2ih2SfZxS6Wlhw4IVLE8Nzi90JjL9zzBHHBEjowtoc0wzlMRWCM_nvYM9Q6LRKSXtm-Tb5_mFuhXB0GoHoThDCoKMMrTRmMM_x81uE4AxYpNKwp93EtsDxyp9JMo0KbqBLwbxdmlgerFbhNorFton1fYZNf0jnJuDbcRn-2ZCRsWtn61xgQqJ0X_Q94mPtUHDC_0mNbeI7LHKPvH7dFMbARTtLOoUn0Mfruz-93rc_4d0acHUJ09j7VWRKTrCMWNtVs5p8AVWgCg");
  const timestamp: string = (new Date().getTime() / 1000).toFixed(0).toString();

  if (user.authenticated) {
    console.log(user);
    const metadata = getMetadata();
    const articles = await getArticles(req.query);
    const log: ApiLog = {
      timestamp,
      success: !isError(articles),
      query: req.query,
      error: isError(articles) ? articles : null,
    };

    await addLog(user, log);
    if (isError(articles)) {
      res.send(articles);
    } else {
      res.send({ metadata, articles });
    }
  } else {
    const error = generateError(401, "Bad Authentication", "Failed to verify authentication token");
    await addLog(user, {
      timestamp,
      success: false,
      query: req.query,
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
