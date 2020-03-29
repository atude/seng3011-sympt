import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '@ui-kitten/components';
import { signOut } from '../firebase/firebaseFunctions';
import Colors from '../constants/Colors';

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text>hi</Text>
      <Button onPress={() => signOut()}>temp sign out button</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  contentContainer: {
    paddingTop: 15,
  },
});
