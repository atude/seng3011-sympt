/* eslint-disable import/order */
/* eslint-disable import/first */
import express from 'express';
import * as admin from 'firebase-admin';

require('dotenv').config();
const serviceAccount = require('../service-account.json');

admin.initializeApp({ 
  credential: admin.credential.cert({
    ...serviceAccount,
    private_key: process.env.FIREBASE_KEY?.replace(/\\n/g, '\n') ?? "",
  }),
});

import {/*queryScrapePosts,*/ querySpecificPosts }from './queryController';

const app = express();
const port: number = Number(process.env.PORT) || 4001;

var exampleQuery = '?keyterms=coronavirus,disease&startdate=2020-01-31T00:00:00&enddate=2020-02-01T00:00:00&location=china';

exampleQuery = exampleQuery.split("?")[1]
const tokens: string[] = exampleQuery.split("&");
const keyterms : string[] = tokens[0].split("=")[1].split(",");
const startDate = tokens[1].split("=")[1];
const endDate = tokens[2].split("=")[1];
const location = tokens[3].split("=")[1];

console.log("keyterms " + keyterms + " location " + location);

app.get('/proMed', async (req, res) => {
  // res.send(await queryScrapePosts(exampleQuery));
  res.send(await querySpecificPosts(startDate, endDate, location, keyterms));
});

app.listen(port, '0.0.0.0', () => console.log(`--> Server is listening on ${port}`));
