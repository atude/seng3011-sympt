import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import StyledCard from '../components/StyledCard';
import StyledButton from '../components/StyledButton';

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;

  const goToArticleFeed = (navigation) => {
    navigation.navigate('ArticleFeedScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <StyledButton onPress={() => {goToArticleFeed(navigation)}} title="Back To Articles"></StyledButton>
        <StyledCard>
          <StyledText>This is an expanded article! {article.main_text}</StyledText>
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

export default ArticleScreen;