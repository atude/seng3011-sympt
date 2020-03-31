import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import MapView from 'react-native-maps';

import StyledText from '../components/StyledText';
import StyledCard from '../components/StyledCard';

const SelfReportMapScreen = (props) => {

  return (
    <View contentContainerStyle={styles.container}>
      <MapView style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      <MapView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});

export default SelfReportMapScreen;