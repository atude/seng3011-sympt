import { getFetchMeta } from "../utils/fetchTools";

export const setSymptoms = async (userContext, selectedMap) => {
  const selectedSymptoms = [...selectedMap.keys()].toString();
  const selectedDetails = [];

  try {
    let response = await fetch(`https://sympt-server.herokuapp.com/_userDetails/?symptoms=${selectedSymptoms}&details=${selectedDetails}`, 
      getFetchMeta(userContext.user.uid));
    response = await response.json();
    return response;
  } catch (error) {
    console.warn(error);
  }

  return null;
};
