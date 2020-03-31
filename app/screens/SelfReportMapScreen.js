import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

import StyledText from '../components/StyledText';

const SelfReportMapScreen = (props) => {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledText>Ah yes.. maps</StyledText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
});

export default SelfReportMapScreen;