import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '../components/StyledText';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <StyledText>
        Login goes here
      </StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    padding: 50,
  }, 
});

export default LoginScreen;