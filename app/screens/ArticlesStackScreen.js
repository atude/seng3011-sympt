import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleFeedScreen from './ArticleFeedScreen'
import ArticleScreen from './ArticleScreen';

const ArticleStack = createStackNavigator();

const ArticlesStackScreen = (props) => {
  return (
    <ArticleStack.Navigator 
        screenOptions={{
            headerShown: false
      }}>
      <ArticleStack.Screen name="ArticleFeedScreen" component={ArticleFeedScreen} />
      <ArticleStack.Screen name="ArticleScreen" component={ArticleScreen} />
    </ArticleStack.Navigator>
  );
};

export default ArticlesStackScreen;