import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ArticleFeedScreen from '../screens/ArticlesScreen';
import TrendingScreen from '../screens/TrendingScreen';
import Colors from '../constants/Colors';
import PromedFiltersSection from '../components/PromedFiltersSection';
// import FiltersSection from '../components/FiltersSection';

const Tab = createMaterialTopTabNavigator();

export default function TopTabFeedNavigator() {
  return (
    <>  
      {/* <FiltersSection/> */}
      <PromedFiltersSection/>
      <Tab.Navigator 
        initialRouteName="Trending"
        tabBarOptions={{
          indicatorStyle: {
            backgroundColor: Colors.primary
          }
        }}
      >
        <Tab.Screen name="Trending" component={TrendingScreen} />
        <Tab.Screen name="Articles" component={ArticleFeedScreen} />
      </Tab.Navigator>
    </>
  );
}
