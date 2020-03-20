// Data to return with each request 
let dateTime = new Date().toISOString();
dateTime = dateTime.split(".")[0];
const data = <JSON><unknown>{
  team: "Beams",
  time_accessed: dateTime,
  data_source: "ProMed",
};

export default data;
