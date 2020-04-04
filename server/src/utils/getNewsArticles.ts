// import hashString from "./hashString";

const NewsAPI = require('newsapi');


const fetchArticles = async (diseases: string | undefined, location: string | null) => {
  const newsapi = new NewsAPI('00ec351a3f24432190a40b594fc6f352');
  
  if (location === 'Australia') {
    const results = await newsapi.v2.everything({
      q: diseases,
      qInTitle: diseases,
      domains: "abc.net.au,9news.com.au,dailytelegraph.com.au,smh.com.au,news.com.au,theaustralian.com.au,theage.com.au,sbs.com.au,heraldsun.com.au,huffingtonpost.com.au,couriermail.com.au,perthnow.com.au,canberratimes.com.au,watoday.com.au,brisbanetimes.com.au,goldcoastbulletin.com.au,crikey.com.au,themercury.com.au,ntnews.com.au,northernstar.com.au,independentaustralia.net,indaily.com.au,townsvillebulletin.com.au,businessnews.com.au,theshovel.com.au,kalkinemedia.com,coffscoastadvocate.com.au,dailyexaminer.com.au,ibtimes.com.au,newsagencyblog.com.au,whitsundaytimes.com.au,jewishnews.net.au,tasmaniantimes.com,goulburnpost.com.au,ballinaadvocate.com.au,alicespringsnews.com.au,sydneysun.com,16news.com.au,perthherald.com,theconservative.com.au",
      language: 'en',
      sortBy: 'publishedAt',
    });
    return results;
  } 
  const results = await newsapi.v2.everything({
    q: diseases,
    qInTitle: diseases,
    language: 'en',
    sortBy: 'publishedAt',
  });
  return results;
};

const getNewsArticles = async (url: string) => {
  const searchQueries = new URLSearchParams(url);
  const queryDiseases = searchQueries.get('diseases');
  const queryLocation = searchQueries.get('location');
  const searchDiseases = queryDiseases?.split(',').join(' OR ');

  const newsArticles = await fetchArticles(searchDiseases, queryLocation);
  return newsArticles;
};


export default getNewsArticles;
