import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import StyledText from '../components/StyledText';

export default function TrendingScreen() {
  return (
    <ScrollView style={styles.containerParent} contentContainerStyle={styles.container}>
      <StyledCard>
        <StyledText>
          hello this is some styled text
        </StyledText>
      </StyledCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
  containerParent: {
    height: "100%",
  }
});
