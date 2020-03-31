import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { signOut } from '../functions/accountFunctions';
import Colors from '../constants/Colors';
import { UserContext } from '../context/context';

import StyledButton from '../components/StyledButton';
import StyledText from '../components/StyledText';

const ProfileScreen = () => {
  const userContext = useContext(UserContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledButton 
        onPress={() => signOut()} 
        title="Sign out"
      />
      <StyledText>{userContext.user.email}</StyledText>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
});

export default ProfileScreen;