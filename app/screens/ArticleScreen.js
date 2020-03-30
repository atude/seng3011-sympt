import React from 'react';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';

const ArticleScreen = (props) => {
  const article = props.article;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledText>This is an expanded article! {article.main_text}</StyledText>
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