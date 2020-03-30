import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { signOut } from '../functions/accountFunctions';
import Colors from '../constants/Colors';
import StyledButton from '../components/StyledButton';

const ProfileScreen = (props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledButton 
        onPress={() => signOut()} 
        title="Sign out"
      />
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