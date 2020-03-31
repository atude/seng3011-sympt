import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import mapColors from '../utils/mapColors';
import Colors from '../constants/Colors';

const StyledText = (props) => {
  if (props.link) {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(props.link)}>
        <Text
          {...props}
          style={[
            styles.link,
            props.style
          ]}
        >
          {props.children}
        </Text>
      </TouchableOpacity>
    );
  }
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
  link: {
    color: Colors.primary,
    textAlign: 'center',
    width: "100%",
    fontWeight: 'bold',
  },
});

export default StyledText;