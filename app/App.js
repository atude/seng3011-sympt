import React, { useState, useEffect, useRef } from 'react';
import {Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './firebase/firebaseInit';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import LoginScreen from './screens/LoginScreen';

import { UserContext, DiseaseContext, FeedContext } from './context/context';
import diseases from './constants/diseases.json';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isUserLoadingComplete, setUserLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();

  const containerRef = useRef();

  const { getInitialState } = useLinking(containerRef);

  const [user, setUser] = useState(firebase.auth().currentUser);
  const [userLocation, setUserLocation] = useState({});
  const [disease, setDisease] = useState(diseases[0]);
  const [keyTerms, setKeyTerms] = useState([]);
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [feedLocation, setFeedLocation] = useState("Australia");

  //TODO: add initial load from async storage for persistence

  // Context definers
  const userContextValue = {
    user: user || null,
    userLocation, 
    setUserLocation: (location) => setUserLocation(location),
  };

  const diseaseContextValue = {
    disease,
    setDisease: (newDiseaseName) => 
      setDisease(diseases.find((thisDiseases) => thisDiseases.name === newDiseaseName)),
  };

  const feedContextValue = {
    keyTerms,
    removeKeyTerm: (keyTerm) => setKeyTerms(keyTerms.filter((term) => term !== keyTerm)),
    addKeyTerm: (keyTerm) =>  setKeyTerms([...keyTerms, keyTerm]),
    setKeyTerms: (keyTermArray) => setKeyTerms(keyTermArray),
    setFiltersOpen: (openState) => setFiltersOpen(openState),
    isFiltersOpen,
    feedLocation,
    setFeedLocation: (location) => setFeedLocation(location),
  };

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
          'open-sans-light': require('./assets/fonts/OpenSans-Light.ttf'),
          'open-sans-semibold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
          'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
          'open-sans-italic': require('./assets/fonts/OpenSans-Italic.ttf'),
          'montserrat-semibold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
          'main': require('./assets/fonts/SFPro-Regular.ttf'),
        });

        // Setup firebase user
        firebase.auth().onAuthStateChanged((currUser) => {
          if (currUser) {
            setUser(currUser);
            console.log("Auth state changed => " + currUser.email);
          } else {
            setUser(null);
          }
          setUserLoadingComplete(true);
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);


  if ((!isLoadingComplete || !isUserLoadingComplete) && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <UserContext.Provider value={userContextValue}>
          <DiseaseContext.Provider value={diseaseContextValue}>
            <FeedContext.Provider value={feedContextValue}>
              {Platform.OS === "ios" && <StatusBar barStyle="light-content" />}
              {!user ? (
                <LoginScreen />
              ) : (
                <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
                  <Stack.Navigator>
                    <Stack.Screen name="Root" component={BottomTabNavigator} />
                  </Stack.Navigator>
                </NavigationContainer>
              )}
            </FeedContext.Provider>
          </DiseaseContext.Provider>
        </UserContext.Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
