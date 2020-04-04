export const getDiseaseCases = async (diseaseDbName, location) => {
  try {
    let response = await fetch(`https://sympt-server.herokuapp.com/_cases/?disease=${diseaseDbName}&location=${location}`);
    response = await response.json();
    return response;
  } catch (error) {
    console.warn(error);
  }

  return null;
};
  