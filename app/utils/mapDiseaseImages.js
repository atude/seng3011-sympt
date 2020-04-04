export const getDiseaseImage = (diseaseName) => {
  switch (diseaseName) {
  case "covid-19": return require('../assets/images/diseases/covid-19.png');
  case "malaria": return require('../assets/images/diseases/malaria.png');
  case "measles": return require('../assets/images/diseases/measles.png');
  case "rabies": return require('../assets/images/diseases/rabies.png');
  case "influenza": return require('../assets/images/diseases/influenza.png');
  case "smallpox": return require('../assets/images/diseases/smallpox.png');
  case "hepatitis-b": return require('../assets/images/diseases/hepatitis-b.png');
  case "chickenpox": return require('../assets/images/diseases/chickenpox.png');
  case "syphilis": return require('../assets/images/diseases/syphilis.png');
  case "anthrax": return require('../assets/images/diseases/anthrax.png');
  case "botulism": return require('../assets/images/diseases/botulism.png');
  case "brucellosis": return require('../assets/images/diseases/brucellosis.png');
  case "chikungunya": return require('../assets/images/diseases/chikungunya.png');
  case "cholera": return require('../assets/images/diseases/cholera.png');
  case "cryptosporidiosis": return require('../assets/images/diseases/cryptosporidiosis.png');
  case "dengue": return require('../assets/images/diseases/dengue.png');
  case "diphteria": return require('../assets/images/diseases/diphteria.png');
  case "hepatitis-a": return require('../assets/images/diseases/hepatitis-a.png');
  case "hepatitis-c": return require('../assets/images/diseases/hepatitis-c.png');
  case "hepatitis-d": return require('../assets/images/diseases/hepatitis-d.png');
  case "hepatitis-e": return require('../assets/images/diseases/hepatitis-e.png');
  case "mumps": return require('../assets/images/diseases/mumps.png');
  case "pertussis": return require('../assets/images/diseases/pertussis.png');
  case "plague": return require('../assets/images/diseases/plague.png');
  case "q fever": return require('../assets/images/diseases/q fever.png');
  case "rotavirus": return require('../assets/images/diseases/rotavirus.png');
  case "rubella": return require('../assets/images/diseases/rubella.png');
  case "salmonellosis": return require('../assets/images/diseases/salmonellosis.png');
  case "tuberculosis": return require('../assets/images/diseases/tuberculosis.png');
  case "tularaemia": return require('../assets/images/diseases/tularaemia.png');
  case "west nile virus": return require('../assets/images/diseases/west nile virus.png');
  case "yellow fever": return require('../assets/images/diseases/yellow fever.png');
  case "listeriosis": return require('../assets/images/diseases/listeriosis.png');

  default: return require('../assets/images/diseases/_default.png');
  }
};