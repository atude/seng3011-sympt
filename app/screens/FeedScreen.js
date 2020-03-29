import * as React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TopTabFeedNavigator from '../navigation/TopTabFeedNavigator';

export default function FeedScren() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text>This is where articles and newsfeed will go</Text>

      <NavigationContainer independent={true}>
        <TopTabFeedNavigator />
      </NavigationContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }, 
});
