import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';
import getTrendingArticles from '../functions/trendingFunctions';
import NewsCard from '../components/NewsCard';
import { DiseaseContext, FeedContext } from '../context/context';

export default function TrendingScreen() {
  const [articles, setArticles] = useState(null);
  const [isLoadingTrending, setLoadingTrending] = useState(false);
  const diseaseContext = useContext(DiseaseContext);
  const feedContext = useContext(FeedContext);

  useEffect(() => {
    if (!articles) {
      fetchTrendingArticles();
    }
  }, []);

  const fetchTrendingArticles = async () => {
    setLoadingTrending(true);
    const articlesResponse = await getTrendingArticles(feedContext.keyTerms, diseaseContext.disease, feedContext.feedLocation);
    setArticles(articlesResponse);
    setLoadingTrending(false);
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl 
          colors={[Colors.primary, Colors.secondary]}
          refreshing={isLoadingTrending}
          onRefresh={() => fetchTrendingArticles()}
        />
      }
    >
      {articles ? formatArticles(articles) : <ActivityIndicator size='large' color={Colors.primary}/>}
    </ScrollView>
  );
}

const formatArticles = (articles) => {
  if(!articles || !articles.length) {
    return <StyledText nofound>No news articles or tweets found</StyledText>;
  }
  const formattedArticles = articles.map((article, i) => {
    return (
      <View key={i}> 
        <NewsCard article={article}/>
      </View>
    );
  });
  return formattedArticles;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
  containerParent: {
    height: "100%",
  }
});


