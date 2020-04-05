import firebase from '../firebase/firebaseInit';
import { getFetchMeta } from "../utils/fetchTools";



export const setSymptoms = async (userContext, selectedMap) => {
  const selectedSymptoms = [...selectedMap.keys()].toString();
  const selectedDetails = [];

  const data = {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  };

  try {
    // let response = await fetch(`https://sympt-server.herokuapp.com/_userDetails/?symptoms=${selectedSymptoms}&details=${selectedDetails}`, 
    //   getFetchMeta(userContext.user.uid));
    let response = await fetch(`https://sympt-server.herokuapp.com/_userDetails/?symptoms=${selectedSymptoms}&details=${selectedDetails}`, 
      data);
    response = await response.json();
    return response;
  } catch (error) {
    console.warn(error);
  }

  return null;
};

// export const getSelfReportedCases = () => { // Should return array of coordinates of sick people... 


// }
