import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import SymptBanner from '../assets/images/banner.png';

import { Input, Text, Button, Icon } from '@ui-kitten/components';
import { signInEmail, createAccount } from '../firebase/firebaseFunctions';
import Colors from '../constants/Colors';

const initAnimDurationMs = 2000;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setSignIn] = useState(true);
  const [error, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [yPosAnim] = useState(new Animated.Value(-200));

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    
    if (isSignIn) {
      const response = await signInEmail(email, password);
      if (response.message) {
        setError(response.message);
      }
    } else {
      const response = await createAccount(email, password);
      if (response.message) {
        setError(response.message);
      }
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: initAnimDurationMs,
    }).start();

    Animated.timing(yPosAnim, {
      toValue: 0,
      easing: Easing.elastic(1),
      duration: initAnimDurationMs,
    }).start();
  }, []);

  useEffect(() => {
    setError("");
  }, [email, password]);

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
      <Animated.Image 
        source={SymptBanner} 
        style={[{ 
          marginBottom: yPosAnim,
        }, styles.banner]}
      />
      <View style={styles.inputFieldContainer}>
        <Input 
          autoCapitalize="none"
          style={styles.inputField}
          textContentType="emailAddress"
          value={email}
          placeholder='email@email.com'
          textStyle={styles.inputText}
          labelStyle={styles.inputLabel}
          captionTextStyle={styles.inputCaption}
          onChangeText={(value) => setEmail(value)}
          label='Email Address'
          status={error ? "danger" : "primary"}
          size="large"
        />
        <Input 
          autoCapitalize="none"
          style={styles.inputField}
          textContentType="password"
          secureTextEntry={!showPassword}
          icon={() => 
            <Icon 
              width={28} height={28} 
              fill={Colors.primary} 
              name={showPassword ? "eye" : "eye-off"}
            />
          }
          onIconPress={() => setShowPassword(!showPassword)}
          value={password}
          placeholder='*******'
          textStyle={styles.inputText}
          labelStyle={styles.inputLabel}
          captionTextStyle={styles.inputCaption}
          onChangeText={(value) => setPassword(value)}
          label='Password'
          status={error ? "danger" : "primary"}
          size="large"
        />
        <Text style={styles.errorText} status="danger">
          {error}
          {"\n"}
        </Text>
        <Button 
          size="large" 
          onPress={() => handleSubmit()} 
          status={isSignIn ? "primary" : "info"}
        >
          {isSignIn ? "SIGN IN" : "SIGN UP"}
        </Button>
        <ActivityIndicator 
          size={50} 
          style={styles.spinner} 
          animating={loadingSubmit}
          color={Colors.info}
        />
      </View>
      <Text 
        style={styles.toggleSubmitText} 
        status="info"
        onPress={() => setSignIn(!isSignIn)}
      >
        {isSignIn ? 
          "Don't have an account? Sign up instead." :
          "Already have an account? Sign in instead."
        }
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    padding: 50,
    flex: 1,
  }, 
  banner: {
    width: "70%",
    resizeMode: "contain",
    flex: 0.6,
  },  
  inputFieldContainer: {
    width: "100%",
    flex: 1,
  },  
  inputField: {
    marginBottom: 20,
  },
  toggleSubmitText: {
    textDecorationLine: "underline",
  },  
  spinner: {
    padding: 20,
  },  
  errorText: {
    textAlign: "center",
  }
});

export default LoginScreen;