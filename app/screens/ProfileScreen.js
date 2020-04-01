import React, { useContext } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { signOut } from '../functions/accountFunctions';
import Colors from '../constants/Colors';
import { UserContext } from '../context/context';
import { Ionicons } from '@expo/vector-icons';

import StyledText from '../components/StyledText';
import StyledCard from '../components/StyledCard';

const ProfileScreen = () => {
  const userContext = useContext(UserContext);
  const profilePic = require("../assets/images/logo.png");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        <Image
          source={profilePic}
          style={styles.img}
        />
        <StyledText style={styles.email}>{userContext.user.email}</StyledText>
      </View>

      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          flexDirection: 'row',
        }}>
          <View style={{paddingRight: 20, width: 150, height: 280}}>
            <StyledCard>
              <TouchableOpacity>
                <Ionicons name="md-mail-open" size={32} style={styles.icon} />
                <StyledText style={styles.heading}>{"Update\nEmail"}</StyledText>
              </TouchableOpacity>
            </StyledCard>
            <StyledCard>
              <TouchableOpacity>
                <Ionicons name="md-medkit" size={32} style={styles.icon} />
                <StyledText style={styles.heading}>{"Update Additional Details"}</StyledText>
              </TouchableOpacity>
            </StyledCard>
          </View>

          <View style={{width: 130, height: 280}}>
            <StyledCard>
              <TouchableOpacity>
                <Ionicons name="md-thermometer" size={32} style={styles.icon} />
                <StyledText style={styles.heading}>{"Update Symptoms"}</StyledText>
              </TouchableOpacity>
            </StyledCard>
            <StyledCard>
              <TouchableOpacity onPress={() => signOut()}>
                <Ionicons name="md-contact" size={32} style={styles.icon} />
                <StyledText style={styles.heading}>{"\nSign Out"}</StyledText>
              </TouchableOpacity>
            </StyledCard>
          </View>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 30,
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 120,
    height: 120
  },
  heading: {
    textAlign: 'center',
  },
  email: {
    fontSize: 22,
    padding: 22,
  },
  icon: {
    textAlign: 'center',
    color: Colors.primary,
  }
});

export default ProfileScreen;