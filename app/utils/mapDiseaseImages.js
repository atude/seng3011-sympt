export const getDiseaseImage = (diseaseName) => {
  switch (diseaseName) {
  case "covid-19": return require('../assets/images/diseases/covid-19.png');
  default: return require('../assets/images/diseases/_default.png');
  }
};