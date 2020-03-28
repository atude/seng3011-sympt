import firebase from 'firebase';
import 'firebase/firestore';

import { REACT_APP_FIREBASE_API_KEY } from 'react-native-dotenv';

const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: "sympt-1259e.firebaseapp.com",
  databaseURL: "https://sympt-1259e.firebaseio.com",
  projectId: "sympt-1259e",
  storageBucket: "sympt-1259e.appspot.com",
  messagingSenderId: "955206781936",
  appId: "1:955206781936:web:944bf5a9b8b69c90f86b35",
  measurementId: "G-229NY6H6NP",
};

// First init
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  console.log("Initialised firebase.");
}

export default firebase;

