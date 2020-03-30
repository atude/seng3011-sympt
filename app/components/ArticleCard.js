import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import StyledCard from './StyledCard';
import StyledText from './StyledText';

const ArticleCard = (props) => {
    const article = props.article;
  return (
    <View>
      <StyledCard>
        <StyledText>{article.headline}</StyledText>
        <StyledText>
          {article.url}
        </StyledText>
      </StyledCard>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "sfpro",
  }, 
});

export default ArticleCard;