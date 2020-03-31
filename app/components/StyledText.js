import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import mapColors from '../utils/mapColors';
import Colors from '../constants/Colors';

const StyledText = (props) => {
  if (props.nofound) {
    return (
      <Text
        {...props}
        style={[
          styles.nofound,
          props.style
        ]}
      >
        {props.children}
      </Text>
    );
  }
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
    fontFamily: "main",
    fontSize: 16,
  }, 
  link: {
    color: Colors.primary,
    textAlign: 'center',
    width: "100%",
    fontWeight: 'bold',
  },
  nofound: {
    color: Colors.dull,
    textAlign: 'center',
    fontWeight: 'bold',
    width: "100%",
    textTransform: "uppercase",
  }
});

export default StyledText;