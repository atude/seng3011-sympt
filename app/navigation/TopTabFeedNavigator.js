import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ArticlesScreen from '../screens/ArticlesScreen';
import TrendingScreen from '../screens/TrendingScreen';

const Tab = createMaterialTopTabNavigator();

export default function TopTabFeedNavigator() {
  return (
    <Tab.Navigator initialRouteName="Articles">
      <Tab.Screen name="Articles" component={ArticlesScreen} />
      <Tab.Screen name="Trending" component={TrendingScreen} />
    </Tab.Navigator>
  );
}
