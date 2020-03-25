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
  const user: ApiUser = await verifyUser("eyJhbGciOiJSUzI1NiIsImtpZCI6IjFmODhiODE0MjljYzQ1MWEzMzVjMmY1Y2RiM2RmYjM0ZWIzYmJjN2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc3ltcHQtMTI1OWUiLCJhdWQiOiJzeW1wdC0xMjU5ZSIsImF1dGhfdGltZSI6MTU4NDkyNjAzNSwidXNlcl9pZCI6Im1MYW5iNGJiVWZXZUJIcW1DQndZNDc2WjdrcjEiLCJzdWIiOiJtTGFuYjRiYlVmV2VCSHFtQ0J3WTQ3Nlo3a3IxIiwiaWF0IjoxNTg1MTE3NzQwLCJleHAiOjE1ODUxMjEzNDAsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.QagaWiwpXFJjJh-sJNBWXGg3QSzhg6VSILxrmjDhB_BYsdxuMZmItqm9WWZAS67TuHgmrJWRoagPrDIuxdNeWXWqmWFcX8w1h71OTrqyzELvcS-Ny44t2Qv39vhUhSUWmILwCwjElI1KbvlbiacIgjNpvzihgdc-uYDKXCSmTsrMJb0jo2yaTtMXWmkgnbdX1jVUp34NIveuNdLXrWk-FuQpTglRWaW0zAytqkxdpzT4U3ofjN5hAAWD2XmW8RADXYPPrN_OpeQ151vvqhwxiz9RnOqCUN1c5bbozejZCkH6RnXUBqJr_xRrnz1EK532Xr1GkvNRg7YFgMZ6Z8cKhg");
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
      metadata = getMetadata(articles.length);
    } else {
      metadata = getMetadata(0);
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
