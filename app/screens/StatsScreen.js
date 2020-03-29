import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '@ui-kitten/components';
import { signOut } from '../firebase/firebaseFunctions';
import Colors from '../constants/Colors';

export default function StatsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button onPress={() => signOut()}>temp sign out button</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
});
