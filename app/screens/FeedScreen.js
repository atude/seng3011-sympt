import React from 'react';
import TopTabFeedNavigator from '../navigation/TopTabFeedNavigator';
import ArticleScreen from './ArticleScreen';
import { createStackNavigator } from '@react-navigation/stack';

const FeedStack = createStackNavigator();

const FeedScreen = (props) => {
  return (
    <FeedStack.Navigator 
      headerMode="float"
      screenOptions={{
        headerShown: false
      }}>
      <FeedStack.Screen name="TopTabFeedNavigator" component={TopTabFeedNavigator} />
      <FeedStack.Screen name="ArticleScreen" component={ArticleScreen} />
    </FeedStack.Navigator>
  );
};

export default FeedScreen;