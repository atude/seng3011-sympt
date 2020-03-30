import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { UserContext } from '../context/context';
import { getFeedArticles } from '../functions/articleFunctions';
import ArticleCard from '../components/ArticleCard';

const diseases = ["coronavirus"];
const location = "china";

const ArticlesScreen = (props) => {
  const [articles, setArticles] = useState([]);
  const [isLoadingArticles, setLoadingArticles] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    setLoadingArticles(true);
    const fetchFeedArticles = async () => {
      const articlesResponse = await getFeedArticles(userContext.user.uid, location, diseases);
      setArticles(articlesResponse.articles);
    };  

    fetchFeedArticles();
    setLoadingArticles(false);
  }, []);

  const articleFeed = articles.map((article,i) => {
    return (
      <View key={i}> 
        <ArticleCard article={article} navigation={props.navigation}/>
      </View>
    );
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {articleFeed}
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
