import firebase from './firebaseInit';
import { ApiLog } from '../types';

export const signInEmail = async (email: string, password: string) => {
  const response = await firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.log(error.message);
      return (error);
    });

  return response;
};

export const createAccount = async (email: string, password: string) => {
  const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((credentials) => {
      console.log(`Made new user => ${credentials?.user?.email}`);
    })
    .catch((error) => {
      console.log(error.message);
      return (error);
    });
  
  return response;
};

export const signOut = () => {
  firebase.auth().signOut().then(() => {
    console.log("Signed out");
  }).catch((error) => {
    console.log(error.message);
  });
};

export const refreshToken = async () => {
  const token = await firebase.auth().currentUser?.getIdToken(true);
  return token;
};

export const fetchLogs = async (userEmail: string): Promise<ApiLog[]> => {
  const logs = await firebase.firestore().collection("apiUsers").doc(userEmail).get();
  if (!logs) return [];

  return Object.values(logs.data() ?? {});
};
