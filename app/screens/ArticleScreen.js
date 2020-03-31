import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import StyledCard from '../components/StyledCard';
import StyledButton from '../components/StyledButton';

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledButton onPress={() => {navigation.goBack();}} title="Back To Articles"></StyledButton>
      <StyledCard>
        <Text style={styles.headline}>{article.headline}</Text>
        <StyledText>{article.date_of_publication}</StyledText>
        <StyledText>{article.main_text}</StyledText>
      </StyledCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
  headline: {
    fontFamily: "sfpro",
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ArticleScreen;