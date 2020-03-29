import firebase from './firebaseInit';
import { parseKeyTerms, getCurrentTime } from '../utils/apiQueryFormatter';

import { REACT_APP_FIREBASE_API_KEY } from 'react-native-dotenv';

// const usersRef = firebase.firestore().collection("users");

export const signInEmail = async (email, password) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(error => {
    console.warn(error.message);
    return(error);
  });
};

export const createAccount = async (email, password) => {
  // Check if username unused
  // const getUser = await getUserByUsername(username);
  // console.log(getUser);
  // if(getUser) return "Username has been taken.";

  //Create auth details
  return await firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((credentials) => {
    // Create firestore doc for user
    // usersRef.doc(username.toLowerCase()).set({
    //   id: credentials.user.uid,
    //   email: credentials.user.email
    // });

    console.log("Made new user => " + credentials.user.email);
  })
  .catch(error => {
    console.warn(error.message);
    return(error);
  });
};

export const signOut = () => {
  firebase.auth().signOut().then(() => {
    console.log("Signed out");
  }).catch(error => {
    console.log(error.message);
  });
};

const fetchStats = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    authorization: REACT_APP_FIREBASE_API_KEY
  }
}

// location: string, keyterms: array
export const getFeedArticles = async (location, keyterms) => {

  const startDate = "2015-01-01T00:00:00";
  const endDate = getCurrentTime();
  const searchTerms = parseKeyTerms(keyterms); // Turns key terms array into comma seperated string

  fetch(`https://sympt-server.herokuapp.com/articles/?startdate=${startDate}&enddate=${endDate}&location=${location}&keyterms=${searchTerms}`, fetchStats)
    .then(response => response.json())
    .then((responseJson) => {
      console.log('getting data from fetch', responseJson)
    })
    .catch(error => console.log(error))
};
