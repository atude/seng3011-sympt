import * as React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';

export default function FeedScren() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text>This is where articles and newsfeed will go</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }, 
});
