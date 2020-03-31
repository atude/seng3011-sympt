import React from 'react';
import { StyleSheet, Text, Linking, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import StyledCard from '../components/StyledCard';
import StyledButton from '../components/StyledButton';

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledCard>
        <Text style={styles.headline}>{article.headline}</Text>
        <Text style={styles.date}>{article.date_of_publication}</Text>
        <StyledText>{article.main_text}</StyledText>
        <TouchableOpacity onPress={() => Linking.openURL(`${article.url}`)}>
          <Text style={styles.promedLink}>View on ProMed-mail</Text>
        </TouchableOpacity> 
      </StyledCard>
      <StyledCard>
        <StyledText>Sentiment Analysis section</StyledText>
      </StyledCard>
      <StyledButton onPress={() => {navigation.goBack();}} title="Back To Articles"></StyledButton>
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
  date: {
    fontFamily: "sfpro",
    fontSize: 12,
  },
  promedLink: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default ArticleScreen;