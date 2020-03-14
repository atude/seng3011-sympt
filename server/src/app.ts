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

import queryScrapePosts from './queryController';

const app = express();
const port: number = Number(process.env.PORT) || 4000;

const exampleQuery = '?keyterms=coronavirus&startdate=2019-12-01T00:00:00&enddate=2020-02-01T00:00:00&location=china';

app.get('/api', async (req, res) => {
  res.send(await queryScrapePosts(exampleQuery));
});

app.listen(port, '0.0.0.0', () => console.log(`--> Server is listening on ${port}`));
