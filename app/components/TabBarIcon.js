import React from 'react';
import { Icon } from "@ui-kitten/components";
import Colors from '../constants/Colors';

const TabBarIcon = (props) => {
  return (
    <Icon
      name={props.name}
      width={24}
      height={24}
      fill={props.focused ? Colors.primary : Colors.dull}
      style={{
        marginTop: 8,
        marginBottom: 8,
      }}
    />
  );
};

export default TabBarIcon;
