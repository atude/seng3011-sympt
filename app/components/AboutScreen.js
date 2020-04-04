import React, { useContext } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { signOut } from '../functions/accountFunctions';
import Colors from '../constants/Colors';
import { UserContext } from '../context/context';

import StyledText from '../components/StyledText';
import StyledCard from '../components/StyledCard';
import StyledButton from '../components/StyledButton';
import ProfilePage from '../components/ProfilePage';

const AboutScreen = ({ navigation }) => {

  const disclaimer = "Disclaimer";
  const disclaimerBody = "Please note that all cases represented in our heat map have been voluntarily self reported by individual Sympt app users. Sympt is not responsible and cannot guarantee the accuracy of this data nor are we making any recommendations for your personal health. Please see a registered medical professional for an official diagnosis or advice regarding your health concerns.";

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <StyledCard>
      <View style={styles.cardContainer}>
        <StyledText style={styles.heading}>{disclaimer}</StyledText>
        <StyledText style={styles.bodyText}>{disclaimerBody}</StyledText>
      </View>
    </StyledCard>
    <StyledButton
      color={"primary"}
      title={"Go Back"}
      onPress={() => navigation.goBack()}
    />
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 22,
    paddingBottom: 5,
  },
  bodyText: {
    paddingBottom: 5,
  },
});

export default AboutScreen;