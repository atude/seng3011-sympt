export const getDiseaseCases = async (diseaseDbName, location) => {
  try {
    const response = await fetch(`https://sympt-server.herokuapp.com/_cases/?disease=${diseaseDbName}&location=${location}`);
    const jsonRes = await response.json();
    return jsonRes;
  } catch (error) {
    console.warn(error);
    return { error };
  }
};
  