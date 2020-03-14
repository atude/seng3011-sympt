/* eslint-disable import/order */
/* eslint-disable import/first */
import express from 'express';
import * as admin from 'firebase-admin';

require('dotenv').config();
const serviceAccount = require('../service-account.json');

admin.initializeApp({ 
  credential: admin.credential.cert({
    ...serviceAccount,
    private_key: process.env.FIREBASE_KEY,
  }),
});

import {queryScrapePosts, querySpecificPosts }from './queryController';

const app = express();
const port = 4000;

const exampleQuery = '?keyterms=coronavirus&startdate=2019-12-01T00:00:00&enddate=2020-02-01T00:00:00&location=china';

app.get('/', async (req, res) => {
  // res.send(await queryScrapePosts(exampleQuery));
  res.send(await querySpecificPosts(exampleQuery));
});

app.listen(process.env.PORT || port, () => console.log(`--> Server is listening on ${port}`));
