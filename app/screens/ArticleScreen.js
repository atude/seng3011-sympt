import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import StyledText from '../components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import StyledCard from '../components/StyledCard';

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
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