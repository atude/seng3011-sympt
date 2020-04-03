/* eslint-disable no-unused-vars */
import { createContext } from "react";
import firebase from '../firebase/firebaseInit';

export const UserContext = createContext({
  user: firebase.auth().currentUser,
  // TODO: location ?
});

export const DiseaseContext = createContext({
  disease: {
    nameFormatted: "",
    name: "",
    description: "",
    link: "",
  },
  setDisease: (diseaseName) => {},
});

export const FeedContext = createContext({
  keyTerms: [],
  removeKeyTerm: (keyTerm) => {},
  addKeyTerm: (keyTerm) => {},
  setKeyTerms: (keyTermsArray) => {},
  setFiltersOpen: (openState) => {},
  isFiltersOpen: false,
  feedLocation: "",
  setFeedLocation: (location) => {},
});
