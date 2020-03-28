import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';

const BottomTab = createBottomTabNavigator();
const defaultRouteName = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator 
      initialRouteName={defaultRouteName}
      tabBarOptions={{ style: {
        height: 64,
      }}}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="activity" />,
        }}
      />
      <BottomTab.Screen
        name="Yes"
        component={StatsScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="globe-2" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? defaultRouteName;

  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Yes':
      return 'Yes this is a screen';
  }
}
