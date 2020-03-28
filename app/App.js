import React, { useState, useEffect, useRef } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './firebase/firebaseInit';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import LoginScreen from './screens/LoginScreen';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { mapping } from '@eva-design/eva';

import { myTheme } from './constants/lightTheme';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const Stack = createStackNavigator();

export default function App(props) {
	const [isLoadingComplete, setLoadingComplete] = useState(false);
	const [isUserLoadingComplete, setUserLoadingComplete] = useState(false);
	const [initialNavigationState, setInitialNavigationState] = useState();
	const containerRef = useRef();
  const { getInitialState } = useLinking(containerRef);

  const [user, setUser] = useState(null);

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
				});

				// Setup firebase
				firebase.auth().onAuthStateChanged((user) => {
					if (user) {
						setUser(user);
						console.log("Auth state changed => " + user.email);
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
				<IconRegistry icons={EvaIconsPack} />
				<ApplicationProvider mapping={mapping} theme={myTheme}>
					{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
					{!user ? (
						<LoginScreen />
					) : (
						<NavigationContainer ref={containerRef} initialState={initialNavigationState}>
							<Stack.Navigator>
								<Stack.Screen name="Root" component={BottomTabNavigator} />
							</Stack.Navigator>
						</NavigationContainer>
					)}
				</ApplicationProvider>
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
