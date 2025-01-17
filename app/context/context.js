/* eslint-disable no-unused-vars */
import { createContext } from "react";

export const UserContext = createContext({
  apiKey: "",
  userLocation: -1,
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

export const PromedFeedContext = createContext({
  setFiltersOpen: (openState) => {},
  isFiltersOpen: false,
  feedStartDate: "2000-01-01",
  setFeedStartDate: (startDate) => {},
  feedEndDate: "",
  setFeedEndDate: (endDate) => {},
});

export const UserPostcodeContext = createContext({
  userPostcode: 2052,
  setUserPostcode: (postcode) => {},
});
