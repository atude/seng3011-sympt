import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import MapView from 'react-native-maps';

const SelfReportMapScreen = (props) => {

  // Dummy data 
  const infectedSpots = [
              {latitude: -33.8688, longitude: 151.2093},
              {latitude: -33.8660, longitude: 151.2093}
            ]

  const renderCircles = (infectedSpots) => {
    return infectedSpots.map((spot) => (
      <MapView.Circle
                key = { (spot.longitude+spot.latitude).toString() }
                center = { {latitude: spot.latitude, longitude: spot.longitude} }
                radius = { 500 }
                strokeWidth = { 1 }
                strokeColor = { '#1a66ff' }
                fillColor = { 'rgba(230,238,255,0.5)' }
        />
    ));
  } 

  return (
    <View contentContainerStyle={styles.container}>
      <MapView style={styles.map} showsUserLocation={true}
        initialRegion={{
          latitude: -33.8688,
          longitude: 151.2093,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {renderCircles(infectedSpots)}
      </MapView>
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