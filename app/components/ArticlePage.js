import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import StyledText from './StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const maxArticleChars = 1000;

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="ios-arrow-round-back" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headline}>{article.headline}</Text>
      <Text style={styles.date}>Published on {article.date_of_publication}</Text>
      <StyledText>
        {article.main_text.length > maxArticleChars ? 
          `${article.main_text.substr(0, maxArticleChars)}...\n` :
          `${article.main_text}\n`
        }
      </StyledText>
      <StyledText link={article.url}>View full article on ProMed Mail</StyledText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgLight,
    padding: 24,
  }, 
  headline: {
    fontFamily: "sfpro",
    fontWeight: 'bold',
    fontSize: 22,
    paddingBottom: 10,
  },
  date: {
    fontFamily: "sfpro",
    fontSize: 16,
    color: "grey",
    paddingBottom: 10,
  },
  backIcon: {
    fontSize: 40,
    marginTop: -12,
    marginBottom: 5,
    color: Colors.primary
  }
});

export default ArticleScreen;