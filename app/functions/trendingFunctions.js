const getTrendingArticles = async (diseases) => {
  const getNewsArticles = async () => {
    try {
      const newsArticles = await fetch(`https://sympt-server.herokuapp.com/_news/?diseases=${diseases}`);
      const response = await newsArticles.json();
      return response.articles;
    } catch (error) {
      console.warn(error);
    }
    return null;
  };
  
  /*
  const getTweets = async () => {
    return null;
  };
  */
  // join results from both functions later
  return await getNewsArticles();
};

export default getTrendingArticles;