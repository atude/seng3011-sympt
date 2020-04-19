/* eslint-disable no-unused-vars */
import { createContext } from "react";
import { REACT_APP_API_KEY } from 'react-native-dotenv';

export const UserContext = createContext({
  apiKey: REACT_APP_API_KEY,
  userLocation: {},
  setUserLocation: (location) => {},
});

export const DiseaseContext = createContext({
  disease: {
    nameFormatted: "",
    name: "",
    nameDb: "",
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
