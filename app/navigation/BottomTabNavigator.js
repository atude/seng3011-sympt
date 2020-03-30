import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';

import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeedScreen from '../screens/FeedScreen';
import { Button, Image } from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

import SymptLogo from '../assets/images/logo-plain.png'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BottomTab = createBottomTabNavigator();
const defaultRouteName = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ 
    headerTitle: getHeaderTitle(route),
    headerTitleStyle: {
      fontWeight: "bold",
      fontFamily: "sfpro",
      fontSize: 28,
      marginLeft: 10,
      marginTop: 18,
    },
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      height: 120,
      backgroundColor: "#fff",
    },
    headerRight: () => (
      <TouchableOpacity 
        style={{
          marginTop: 20,
          marginRight: 14,
          padding: 10,
        }}
      >
        <TabBarIcon name="filter-outline"/>
      </TouchableOpacity>
    )
  });

  return (
    <BottomTab.Navigator 
      initialRouteName={defaultRouteName}
      tabBarOptions={{ style: {
        height: 50,
        elevation: 0,
        shadowOpacity: 0,
        borderTopColor: "transparent",
      }}}
    >
      <BottomTab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="dna" 
            />
          )
        }}
      />
      <BottomTab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="card-bulleted-outline" 
            />
          )
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="account-circle-outline" 
            />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? defaultRouteName;

  switch (routeName) {
    case 'Activity':
      return 'Activity';
    case 'Feed':
      return 'Your Feed'
    case 'Profile':
      return 'Profile';
  }
}
