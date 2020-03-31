import React from 'react';
import TopTabFeedNavigator from '../navigation/TopTabFeedNavigator';
import Colors from '../constants/Colors';
import ArticleScreen from './ArticleScreen';
import { createStackNavigator } from '@react-navigation/stack';

const TabsTheme = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.bg,
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
  },
};

const FeedStack = createStackNavigator();

const FeedScreen = (props) => {
  return (
    <FeedStack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <FeedStack.Screen name="TopTabFeedNavigator" component={TopTabFeedNavigator} />
      <FeedStack.Screen name="ArticleScreen" component={ArticleScreen} />
    </FeedStack.Navigator>
  );
};

export default FeedScreen;