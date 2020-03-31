import * as React from 'react';
import { StyleSheet } from 'react-native';
import mapColors from '../utils/mapColors';
import { Button } from 'react-native-elements';

const StyledButton = (props) => {
  return (
    <Button 
      {...props} 
      buttonStyle={[{
        backgroundColor: mapColors(props.color || "")
      }, 
      styles.button]} 
      titleStyle={[props.titleStyle, styles.title]}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  title: {
    fontFamily: "main",
    fontWeight: "bold",
  }
});

export default StyledButton;