import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import { Text } from '@ui-kitten/components';

const StyledCard = (props) => {
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    
    elevation: 2,
  }, 
});

export default StyledCard;