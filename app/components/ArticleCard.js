import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import StyledCard from './StyledCard';
import StyledText from './StyledText';

const moment = require('moment');

const ArticleCard = (props) => {
  const article = props.article;

  const goToExpandedArticle = (article) => {
    props.navigation.navigate("ArticleScreen", { article: article });
  };

  return (
    <StyledCard>
      <TouchableOpacity onPress={() => goToExpandedArticle(article)}>
        <View>
          <StyledText style={styles.heading}>{article.headline}</StyledText>
          <StyledText color="primary" style={styles.dateText}>{moment(article.date_of_publication).fromNow()}</StyledText>
          <Text numberOfLines={3} style={styles.textPreview}>{article.main_text}</Text>
        </View>
      </TouchableOpacity>
    </StyledCard>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: "bold",
    paddingBottom: 5,
  },  
  dateText: {
    paddingBottom: 5,
  },
  textPreview: {
    fontFamily: "main",
    color: 'grey',
  }, 
});

export default ArticleCard;