import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { UserContext, DiseaseContext } from '../context/context';
import { getFeedArticles } from '../functions/articleFunctions';
import ArticleCard from '../components/ArticleCard';

const location = "china";

const ArticlesScreen = (props) => {
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setLoadingArticles] = useState(false);
  const userContext = useContext(UserContext);
  const diseaseContext = useContext(DiseaseContext);

  const fetchFeedArticles = async () => {
    setLoadingArticles(true);
    const articlesResponse = await getFeedArticles(userContext.user.uid, location, [diseaseContext.diseaseName]);
    setArticles(articlesResponse.articles);
    setLoadingArticles(false);
  };  

  useEffect(() => {
    fetchFeedArticles();
  }, []);

  return (
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
      {articles.map((article, i) => (
        <View key={i}> 
          <ArticleCard article={article} navigation={props.navigation}/>
        </View>
      ))}
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
});

export default ArticlesScreen;
