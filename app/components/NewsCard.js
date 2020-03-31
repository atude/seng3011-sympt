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
          <Text style={styles.articleSource}>{`Source: ${article.source.name}`}</Text>
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
    fontFamily: "sfpro",
    color: 'grey',
  },
  articleSource: {
    fontFamily: 'sfpro',
    color: '#A8A8A8',
    fontStyle: 'italic',
  },
});

export default NewsCard;