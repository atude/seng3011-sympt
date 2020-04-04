import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import MapView from 'react-native-maps';

const SelfReportMapScreen = (props) => {

  const highSeverity = "#dd2c00";
  const mediumSeverity = '#ff9800';
  const lowSeverity = '#fdd835';

  // Dummy data 
  const infectedSpots = [
    {latitude: -33.8688, longitude: 151.2093, severity: highSeverity}, 
    {latitude: -33.8690, longitude: 151.2193, severity: lowSeverity},
    {latitude: -33.8620, longitude: 151.2093, severity: mediumSeverity},
    {latitude: -33.8640, longitude: 151.2193, severity: highSeverity},
    {latitude: -33.8920, longitude: 151.2093, severity: lowSeverity},
    {latitude: -33.9200, longitude: 151.2300, severity: highSeverity},
    {latitude: -33.8915, longitude: 151.2767, severity: highSeverity},
    {latitude: -33.8915, longitude: 151.2780, severity: highSeverity},
  ];

  const renderCircles = (infectedSpots) => {
    return infectedSpots.map((spot) => (
      <MapView.Circle
        key = { (spot.longitude+spot.latitude).toString() }
        center = { {latitude: spot.latitude, longitude: spot.longitude} }
        radius = { 500 }
        strokeWidth = { 2 }
        strokeColor = { spot.severity }
        fillColor = { spot.severity + "40" }
      />
    ));
  };

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