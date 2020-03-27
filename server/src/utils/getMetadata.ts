// Metadata to return with each request 
const getMetadata = (nArticles: number, email: string) => {
  const dateTime = new Date();
  dateTime.setTime(dateTime.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

  const dateStr = dateTime.toISOString().split(".")[0];
  return <JSON><unknown>{
    team: "Beams",
    user: email,
    time_accessed: dateStr,
    data_source: "ProMed",
    total_articles: nArticles,
  };
};


export default getMetadata;
