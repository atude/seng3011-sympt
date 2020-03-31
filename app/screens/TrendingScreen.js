import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import StyledText from '../components/StyledText';
import getTrendingArticles from '../functions/trendingFunctions';
import { DiseaseContext } from '../context/context';

export default function TrendingScreen() {
  const diseaseContext = useContext(DiseaseContext);
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    if (!articles) {
      const fetchTrendingArticles = async () => {
        const articlesResponse = await getTrendingArticles(diseaseContext.diseaseName);
        setArticles(articlesResponse);
      };
      fetchTrendingArticles();
    }
  }, [articles]);

  return (
    <ScrollView style={styles.containerParent} contentContainerStyle={styles.container}>
      {articles ? formatArticles(articles) : <ActivityIndicator size='large' color={Colors.primary}/>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
  containerParent: {
    height: "100%",
  }
});

const formatArticles = (articles) => {
  if(!articles) {
    return (<StyledCard><StyledText>There are no news articles or tweets</StyledText></StyledCard>);
  }
  const formattedArticles = articles.map((article, i) => {
    return (
    <StyledCard key={i}>
      <StyledText>
        {article.title}
      </StyledText>
    </StyledCard>);
  });
  return formattedArticles;
};
