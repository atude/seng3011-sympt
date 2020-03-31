import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import StyledCard from './StyledCard';
import StyledText from './StyledText';
import { ListItem } from 'react-native-elements';

const ArticleCard = (props) => {
  const article = props.article;

  const goToExpandedArticle = (article) => {
    props.navigation.navigate("ArticleScreen", { article: article });
  };

  return (
    <View>
      <StyledCard>
        <ListItem onPress={() => {goToExpandedArticle(article);}} title={article.headline} subtitle={
          <View>
            <StyledText>{article.date_of_publication}</StyledText>
            <Text numberOfLines={3} style={styles.textPreview}>{article.main_text}</Text>
          </View>
        }/>
      </StyledCard>
    </View>
  );
};

const styles = StyleSheet.create({
  textPreview: {
    fontFamily: "sfpro",
    color: 'grey',
  }, 
});

export default ArticleCard;