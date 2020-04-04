import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, ActivityIndicator, RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';
import getTrendingArticles from '../functions/trendingFunctions';
import { DiseaseContext } from '../context/context';
import NewsCard from '../components/NewsCard';

export default function TrendingScreen() {
  const diseaseContext = useContext(DiseaseContext);
  const [articles, setArticles] = useState(null);
  const [isLoadingTrending, setLoadingTrending] = useState(false);

  useEffect(() => {
    if (!articles) {
      fetchTrendingArticles();
    }
  }, []);

  const fetchTrendingArticles = async () => {
    setLoadingTrending(true);
    const articlesResponse = await getTrendingArticles(diseaseContext.diseaseName);
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
    return <StyledText nofound>There no news articles or tweets found</StyledText>;
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


