import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getFeedArticles } from '../firebase/firebaseFunctions';

const diseases = ["coronavirus"];
const location = "china";
const articles = getFeedArticles(location, diseases);

export default function ArticlesScreen() {

  console.log("In feed", articles);


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text>Articles go here!</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    padding: 15,
  },
});
