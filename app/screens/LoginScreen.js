import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import SymptBanner from '../assets/images/banner.png';

import { signInEmail, createAccount } from '../functions/accountFunctions';
import Colors from '../constants/Colors';
import { Input } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        style={[{ marginBottom: yPosAnim }, styles.banner]}
      />
      <View style={styles.inputFieldContainer}>
        <Input 
          autoCapitalize="none"
          containerStyle={styles.inputField}
          textContentType="emailAddress"
          value={email}
          placeholder='email@email.com'
          inputStyle={styles.inputText}
          onChangeText={(value) => setEmail(value)}
          label='Email Address'
        />
        <Input 
          autoCapitalize="none"
          containerStyle={styles.inputField}
          textContentType="password"
          secureTextEntry={!showPassword}
          rightIcon={() => 
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons 
                style={{ fontSize: 20 }}
                color={Colors.primary} 
                name={showPassword ? "eye" : "eye-off"}
              />
            </TouchableOpacity>
          }
          onIconPress={() => setShowPassword(!showPassword)}
          value={password}
          placeholder='*******'
          inputStyle={styles.inputText}
          onChangeText={(value) => setPassword(value)}
          label='Password'
        />
        <StyledText style={styles.errorText} color="error">
          {error}
          {"\n"}
        </StyledText>
        <StyledButton 
          size="large" 
          onPress={() => handleSubmit()} 
          color={isSignIn ? "primary" : "secondary"}
          title={isSignIn ? "SIGN IN" : "SIGN UP"}
        />
        <ActivityIndicator 
          size={50} 
          style={styles.spinner} 
          animating={loadingSubmit}
          color={Colors.info}
        />
      </View>
      <StyledText 
        color="secondary"
        style={styles.toggleSubmitText} 
        onPress={() => setSignIn(!isSignIn)}
      >
        {isSignIn ? 
          "Don't have an account? Sign up instead." :
          "Already have an account? Sign in instead."
        }
      </StyledText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  inputText: {
    fontFamily: "main",
  },
  labelText: {
    fontFamily: "main",
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