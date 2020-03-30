import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ArticlesStackScreen from '../screens/ArticlesStackScreen';
import TrendingScreen from '../screens/TrendingScreen';

const Tab = createMaterialTopTabNavigator();

export default function TopTabFeedNavigator() {
  return (
    <Tab.Navigator initialRouteName="Trending">
      <Tab.Screen name="Trending" component={TrendingScreen} />
      <Tab.Screen name="Articles" component={ArticlesStackScreen} />
    </Tab.Navigator>
  );
}
