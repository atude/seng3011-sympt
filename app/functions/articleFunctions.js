import { getCurrentTime, parseKeyTerms, getFetchMeta } from "../utils/fetchTools";
  
// location: string, keyterms: array
export const getFeedArticles = async (key, location, keyterms) => {
  const startDate = "2020-01-01T00:00:00";
  const endDate = getCurrentTime();
  const searchTerms = parseKeyTerms(keyterms); // Turns key terms array into comma seperated string

  try {
    let response = await fetch(`https://sympt-server.herokuapp.com/articles/?startdate=${startDate}&enddate=${endDate}&location=${location}&keyterms=${searchTerms}&count=1`, 
      getFetchMeta(key));
    response = await response.json();
    return response;
  } catch (error) {
    console.warn(error);
  }

  return null;
};
  