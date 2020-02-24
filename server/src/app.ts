/* eslint-disable no-console */
import * as express from 'express';
import * as admin from 'firebase-admin';

const serviceAccount = require('../service-account.json');

// Init firebase service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('Hi!');
});

app.listen(process.env.PORT || port, () => console.log(`Server is listening on ${port}`));
