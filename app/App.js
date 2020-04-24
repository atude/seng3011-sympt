import React, { useState, useEffect, useRef } from 'react';
import {Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { REACT_APP_API_KEY } from 'react-native-dotenv';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

import { UserContext, DiseaseContext, FeedContext, PromedFeedContext } from './context/context';
import diseases from './constants/diseases.json';

import { getCurrentTime } from './utils/fetchTools';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();

  const containerRef = useRef();

  const { getInitialState } = useLinking(containerRef);

  // User location is postcode
  const [userLocation, setUserLocation] = useState(-1);
  const [disease, setDisease] = useState(diseases[0]);
  const [keyTerms, setKeyTerms] = useState([]);
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [feedLocation, setFeedLocation] = useState("Australia");
  const [feedStartDate, setFeedStartDate] = useState("2020-01-01");
  const [feedEndDate, setFeedEndDate] = useState(getCurrentTime().split("T")[0]);

  // initial load from async storage for persistence
  const loadSavedStorage = async () => {
    // Either fetch saved disease or set the initial disease
    try {
      const savedDisease = await AsyncStorage.getItem('disease');
      if (savedDisease) {
        console.log(`--> retrieved saved disease from storage ${savedDisease}`);
        setDisease(diseases.find((thisDiseases) => thisDiseases.name === savedDisease));
      }
    } catch (error) {
      console.log(`--> no saved disease, defaulting to first disease in diseases list`);
    }
  };

  // Context definers
  const userContextValue = {
    apiKey: REACT_APP_API_KEY,
    userLocation, 
    setUserLocation: (postcode) => setUserLocation(postcode),
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

  const promedFeedContextValue = {
    setFiltersOpen: (openState) => setFiltersOpen(openState),
    isFiltersOpen,
    feedStartDate,
    setFeedStartDate: (startDate) => setFeedStartDate(startDate),
    feedEndDate,
    setFeedEndDate: (endDate) => setFeedEndDate(endDate),
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

      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
    loadSavedStorage();
  }, []);


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <UserContext.Provider value={userContextValue}>
          <DiseaseContext.Provider value={diseaseContextValue}>
            <FeedContext.Provider value={feedContextValue}>
              <PromedFeedContext.Provider value = {promedFeedContextValue}>
                {Platform.OS === "ios" && <StatusBar barStyle="light-content" />}
                <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
                  <Stack.Navigator>
                    <Stack.Screen name="Root" component={BottomTabNavigator} />
                  </Stack.Navigator>
                </NavigationContainer>
              </PromedFeedContext.Provider>
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
