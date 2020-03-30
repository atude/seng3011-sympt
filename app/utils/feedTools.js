
import { REACT_APP_FIREBASE_API_KEY } from 'react-native-dotenv';

const parseKeyTerms = (keyterms) => {
    return keyterms.toString();
}

const getCurrentTime = () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    return dateTime.toISOString().split(".")[0];
}


const fetchStats = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      authorization: REACT_APP_FIREBASE_API_KEY
    }
  }
  
  // location: string, keyterms: array
  export const getFeedArticles = async (location, keyterms) => {
  
    const startDate = "2015-01-01T00:00:00";
    const endDate = getCurrentTime();
    const searchTerms = parseKeyTerms(keyterms); // Turns key terms array into comma seperated string
  
    fetch(`https://sympt-server.herokuapp.com/articles/?startdate=${startDate}&enddate=${endDate}&location=${location}&keyterms=${searchTerms}`, fetchStats)
      .then(response => response.json())
      .then((responseJson) => {
        console.log('getting data from fetch', responseJson)
      })
      .catch(error => console.log(error))
  };
  