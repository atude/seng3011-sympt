/* eslint-disable no-unused-vars */
import { createContext } from "react";
import firebase from '../firebase/firebaseInit';

export const UserContext = createContext({
  user: firebase.auth().currentUser,
});

export const DiseaseContext = createContext({
  disease: {
    nameFormatted: "",
    name: "",
    description: "",
    link: "",
  },
  setDisease: (diseaseName) => {}
});