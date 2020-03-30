import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import { UserContext } from '../context/context';
import StyledText from '../components/StyledText';
import { getFeedArticles } from '../functions/articleFunctions';

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
      setArticles(articlesResponse);
      console.log(articlesResponse);
    };  

    fetchFeedArticles();
    setLoadingArticles(false);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledCard>
        <StyledText>something</StyledText>
      </StyledCard>
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
