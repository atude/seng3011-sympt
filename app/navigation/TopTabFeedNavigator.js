import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ArticlesFeedScreen from '../screens/ArticleFeedScreen';
import TrendingScreen from '../screens/TrendingScreen';

const Tab = createMaterialTopTabNavigator();

export default function TopTabFeedNavigator() {
  return (
    <Tab.Navigator initialRouteName="Trending">
      <Tab.Screen name="Trending" component={TrendingScreen} />
      <Tab.Screen name="Articles" component={ArticlesFeedScreen} />
    </Tab.Navigator>
  );
}
