import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import StyledCard from './StyledCard';
import StyledText from './StyledText';

const moment = require('moment');

// implement later
const NewsCard = (props) => {
  const article = props.article;
  return (
    <StyledCard>
      <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
        <View>
          <StyledText style={styles.heading}>{article.title}</StyledText>
          <StyledText color="primary" style={styles.dateText}>{moment(article.publishedAt).fromNow()}</StyledText>
          <Text numberOfLines={3} style={styles.textPreview}>{article.content}</Text>
          <StyledText color="grey" style={styles.articleSource}>{`- ${article.source.name}`}</StyledText>
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
    paddingBottom: 5,
  },
  articleSource: {
    fontStyle: 'italic',
    fontSize: 14,
  },
});

export default NewsCard;