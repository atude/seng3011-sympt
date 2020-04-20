export const getAllCasesNswRegions = async () => {
  try {
    const response = await fetch(`https://nswdac-np-covid-19-postcode-heatmap.azurewebsites.net/data_Cases.json`);
    const jsonRes = await response.json();
    return jsonRes;
  } catch (error) {
    console.warn(error);
    return { error };
  }
};
  