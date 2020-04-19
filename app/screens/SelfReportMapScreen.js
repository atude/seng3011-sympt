import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import MapView from 'react-native-maps';
import nswPostcodesCoords from '../constants/nswPostcodesCoords.json';

const SelfReportMapScreen = (props) => {

  const nswPointsSet = nswPostcodesCoords.features
    .map((region) => {
      const pointsArray = region.geometry.coordinates[0];
      return pointsArray.map((points) => {
        return {
          latitude: points[1],
          longitude: points[0],
        };
      });
    });

  const renderRegions = () => {
    return (
      nswPointsSet.map((regionPointsArray, i) => {
        console.log(regionPointsArray);
        if (
          !regionPointsArray.length || 
          !regionPointsArray[0] ||
          !regionPointsArray[1]
        ) {
          return null;
        }
        return (
          <MapView.Polygon
            key={i}
            coordinates={regionPointsArray}
            tappable
            strokeWidth={1}
          />
        );
      })
    );
  };

  // console.log(nswPointsSet[0]);

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
        {renderRegions()}
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