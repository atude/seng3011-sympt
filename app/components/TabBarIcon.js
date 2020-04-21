import React from 'react';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StyledText from './StyledText';
import { StyleSheet } from 'react-native';

const TabBarIcon = (props) => {
  return (
    <>
      <MaterialCommunityIcons
        name={props.name}
        color={props.focused ? Colors.primary : Colors.dull}
        style={[props.style, {
          fontSize: props.style ? props.style.fontSize : 26,
        }]}
      />
      <StyledText style={styles.tabBarText} color={props.focused ? "primary" : "grey"}> 
        {props.tabName}
      </StyledText>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarText: {
    fontSize: 12,
  },  
});

export default TabBarIcon;
