import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import mapColors from '../utils/mapColors';

const StyledText = (props) => {
  return (
    <Text
      {...props}
      style={[
        styles.text,
        props.style,
        { color: props.color ? 
          mapColors(props.color) : 
          "rgb(28, 28, 30)"
        }
      ]}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "sfpro",
    fontSize: 16,
  }, 
});

export default StyledText;