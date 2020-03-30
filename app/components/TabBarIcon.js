import React from 'react';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TabBarIcon = (props) => {
  return (
    <MaterialCommunityIcons
      name={props.name}
      color={props.focused ? Colors.primary : Colors.dull}
      style={{
        marginTop: 8,
        marginBottom: 8,
        fontSize: 26,
      }}
    />
  );
};

export default TabBarIcon;
