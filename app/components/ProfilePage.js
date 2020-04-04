import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { signOut } from '../functions/accountFunctions';
import Colors from '../constants/Colors';
import { UserContext } from '../context/context';
import { Ionicons } from '@expo/vector-icons';

import findCoords from '../functions/locationFunctions';

import StyledText from '../components/StyledText';
import StyledCard from '../components/StyledCard';


const ProfileScreen = ({ navigation }) => {
  const userContext = useContext(UserContext);
  const profilePic = require("../assets/images/logo.png");
  
  useEffect(() => {
    if (!userContext.userLocation) {
      setLocation();
    }
  }, []);

  const setLocation = async () => {
    const coords = await findCoords();
    console.log(coords);
    userContext.setUserLocation(coords || {});
  };

  console.log(userContext.userLocation);

  const getCard = (desc, action, iconName) => (
    <TouchableOpacity onPress={action}>
      <StyledCard style={styles.card}>
        <Ionicons name={iconName} size={32} style={styles.icon} />
        <StyledText style={styles.heading}>{desc}</StyledText>
      </StyledCard>
    </TouchableOpacity>
  );

  const goToSymptoms = () => {
    navigation.navigate("SymptomsScreen");
  };

  const goToDetails = () => {
    navigation.navigate("AdditionalDetailsScreen");
  };

  const goToAbout = () => {
    navigation.navigate("AboutScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        <Image source={profilePic} style={styles.img} />
        <StyledText style={styles.email}>{userContext.user.email}</StyledText>
      </View>

      <View style={styles.cardContainer}>
        {getCard("Update Email", null, "md-mail-open")}
        {getCard("Update Details", goToDetails, "md-medkit")}
        {getCard("Update Symptoms", goToSymptoms, "md-thermometer")}
        {getCard("About This App", goToAbout, "md-information-circle-outline")}
        {getCard("Sign Out", signOut, "md-log-out")}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 30,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: 140,
    height: 140,
    margin: 5,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },  
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 120,
    height: 120,
  },
  heading: {
    textAlign: 'center',
    flexWrap: "wrap",
  },
  email: {
    fontSize: 22,
    padding: 22,
  },
  icon: {
    textAlign: 'center',
    color: Colors.primary,
    marginBottom: 10,
  }
});

export default ProfileScreen;