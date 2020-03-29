import { createContext } from "react";
import firebase from '../firebase/firebaseInit';

export const UserContext = createContext({
  user: firebase.auth().currentUser,
});

export const DiseaseContext = createContext({
  diseaseName: "",
  setDisease: (diseaseName) => {},
});