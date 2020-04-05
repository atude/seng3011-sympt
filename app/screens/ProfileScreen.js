import React, { useContext } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { signOut } from '../functions/accountFunctions';
import Colors from '../constants/Colors';
import { UserContext } from '../context/context';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ProfilePage from '../components/ProfilePage';
import SymptomsScreen from '../components/SymptomsScreen';
import AdditionalDetailsScreen from '../components/AdditionalDetailsScreen';
import AboutScreen from '../components/AboutScreen';

const ProfileStack = createStackNavigator();

const ProfileScreen = ({ navigation }) => {
  return (
    <ProfileStack.Navigator
      headerMode="float"
      screenOptions={{
        headerShown: false
      }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfilePage} />
      <ProfileStack.Screen name="SymptomsScreen" component={SymptomsScreen} />
      <ProfileStack.Screen name="AboutScreen" component={AboutScreen} />
      <ProfileStack.Screen name="AdditionalDetailsScreen" component={AdditionalDetailsScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileScreen;