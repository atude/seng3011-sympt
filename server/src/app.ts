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

// Example request from firestore
const getUsername = async (userId: string) => {
  // --> Usually you would also text for authentication
  // here before calling the function, i.e. the function
  // should receive some sort of authentication token here which
  // your firebase admin account can verify that the client
  // is authenticated
  // <--

  // --> How to fetch a doc from firebase
  try {
    // Admin is who has access to firebase
    // Reference firestore and get the document you need
    // Make sure to await since its async call
    const getTestUserDocument = await admin
      .firestore()
      .doc(`users/${userId}`)
      .get();

    // Convert the document into usable data
    const testUserUsername = getTestUserDocument.data();
    return testUserUsername?.username;
  } catch (error) {
    throw new Error(error);
  }
};

/*

--> Heres an example of filtering through a firestore collection
    and getting top 10 usernames in ascending order
    and mapping into an array

const usersCollection = await admin
  .firestore()
  .collection("users")
  .where("username", ">=", args.username.toLowerCase())
  .orderBy("username", "asc")
  .limit(10)
  .get();
const usersDocs = usersCollection.docs.map((doc) => doc.data());

*/

app.get('/', async (req, res) => {
  const getData = await getUsername('test');
  res.send(getData);
});

app.listen(process.env.PORT || port, () => console.log(`Server is listening on ${port}`));
