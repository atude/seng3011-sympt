import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, RefreshControl, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { UserContext, DiseaseContext, FeedContext } from '../context/context';
import { getFeedArticles } from '../functions/articleFunctions';
import ArticleCard from '../components/ArticleCard';
import StyledText from '../components/StyledText';
import { ActivityIndicator } from 'react-native';

const ArticlesScreen = (props) => {
  const [articles, setArticles] = useState(null);
  const [isLoadingArticles, setLoadingArticles] = useState(false);
  const userContext = useContext(UserContext);
  const diseaseContext = useContext(DiseaseContext);
  const feedContext = useContext(FeedContext);

  useEffect(() => {
    if (!articles) {
      fetchFeedArticles();
    }
  }, []);

  const fetchFeedArticles = async () => {
    setLoadingArticles(true);
    const articlesResponse = await getFeedArticles(
      userContext.user.uid, 
      feedContext.feedLocation === "Worldwide" ? "" : feedContext.feedLocation, 
      //add current disease + extra terms
      [diseaseContext.disease.name, ...feedContext.keyTerms]
    );
    setArticles(articlesResponse.articles || []);
    setLoadingArticles(false);
  };  

  const formatArticles = (articles) => {
    if(!articles || !articles.length) {
      return <StyledText nofound>No articles found</StyledText>;
    }
    return articles.map((article, i) => (
      <View key={i}> 
        <ArticleCard article={article} navigation={props.navigation}/>
      </View>
    ));
  };

  return (
    <View>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl 
            colors={[Colors.primary, Colors.secondary]} 
            refreshing={isLoadingArticles} 
            onRefresh={() => fetchFeedArticles()}
          />
        }
      >
        {(articles) ? formatArticles(articles) : <ActivityIndicator size='large' color={Colors.primary}/>}
      </ScrollView>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
});

export default ArticlesScreen;
