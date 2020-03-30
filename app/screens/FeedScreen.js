import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TopTabFeedNavigator from '../navigation/TopTabFeedNavigator';
import Colors from '../constants/Colors';

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

const FeedScreen = (props) => {
  return (
    <NavigationContainer independent={true} theme={TabsTheme}>
      <TopTabFeedNavigator />
    </NavigationContainer>
  );
};

export default FeedScreen;