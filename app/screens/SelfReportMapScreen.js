import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Colors from '../constants/Colors';
import MapView from 'react-native-maps';
import nswPostcodesCoords from '../constants/nswPostcodesCoords.json';
import nswPopulation from '../constants/nswPopulation.json';
import { getAllCasesNswRegions } from '../functions/nswDataFunctions';
import Layout from '../constants/Layout';
import StyledText from '../components/StyledText';
import { formatArrayToCommaString } from '../utils/textFunctions';
import { Slider } from 'react-native-elements';
import { getRegionColorByCases } from '../utils/regionColoring';

const SelfReportMapScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [nswData, setNswData] = useState([]);
  const [currRegion, setRegion] = useState(null);
  const [currDate, setDate] = useState();
  const [allDates, setAllDates] = useState([]);
  const mapRef = useRef(null);

  const fetchData = async () => {
    const allCases = await getAllCasesNswRegions();

    const nswCombinedSet = nswPostcodesCoords.features
      .map((region) => {
        const pointsArray = region.geometry.coordinates[0].map((points) => {
          return {
            latitude: points[1],
            longitude: points[0],
          };
        });
        const casesArray = allCases.data.filter((regionCases) => {
          return regionCases.POA_NAME16 === region.properties.POA_NAME16;
        });

        // TODO: change this and instead 
        // have empty states as 0 cases
        if (!casesArray.length) {
          return null;
        }

        const regionInfo = nswPopulation.find((thisRegionInfo) => 
          thisRegionInfo.POA_NAME16 == region.properties.POA_NAME16
        );

        const population = (regionInfo && regionInfo.Tot_p_p) ?? -1;
        const includedAreas = (regionInfo && 
          regionInfo.Combined.toLowerCase().split(",")
        ) ?? [];

        return {
          postcode: region.properties.POA_NAME16,
          cases: casesArray,
          mapBoundaries: pointsArray,
          population,
          includedAreas,
        };
      })
      .filter((dataSet) => dataSet);
    
    setNswData(nswCombinedSet);
    const datesArray = nswCombinedSet[0].cases.map((regionCases) => {
      return regionCases.Date.replace("-", " ");
    });
    setAllDates(datesArray);
  };

  const getCasesForSetDate = () => {
    const regionDataCases = currRegion.cases.find((cases) => {
      if (currDate)
        return cases.Date === currDate.replace(" ", "-");
      
      return null;
    });
    
    if (!regionDataCases) {
      return 0;
    } else {
      return regionDataCases.Number;
    }
  };

  const getPopulation = () => {
    return nswPopulation.find((area) => area.POA_NAME16 == currRegion.postcode).Tot_p_p;
  };

  useEffect(() => {
    console.log("--> Fetching...");
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  const renderRegions = () => {
    return (
      nswData.map((regionData, i) => {
        const regionPointsArray = regionData.mapBoundaries;
        if (
          !regionPointsArray.length || 
          !regionPointsArray[0] ||
          !regionPointsArray[1]
        ) {
          return null;
        }

        let regionDataCases = regionData.cases.find((cases) => {
          if (currDate)
            return cases.Date === currDate.replace(" ", "-");
          
          return null;
        });
        
        if (!regionDataCases) {
          regionDataCases = 0;
        } else {
          regionDataCases = regionDataCases.Number;
        }
        
        const colorIntensity = getRegionColorByCases(regionDataCases);

        return (
          <MapView.Polygon
            key={i}
            coordinates={regionPointsArray}
            tappable={true}
            onPress={() => setRegion(regionData)}
            fillColor={colorIntensity[0]}
            strokeWidth={2}
            strokeColor={colorIntensity[1]}
          />
        );
      })
    );
  };

  if (loading) return null;

  return (
    <View contentContainerStyle={styles.container}>
      <MapView 
        style={styles.map} 
        ref={(refer) => mapRef.current = refer}
        showsUserLocation={true}
        initialRegion={{
          latitude: -33.8688,
          longitude: 151.2093,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // onLayout={() => mapRef.fitToCoordinates
      >
        {renderRegions()}
      </MapView>
      {allDates.length > 0 && 
        <View style={styles.timelineContainer}>
          <StyledText style={styles.timelineHeading}>Timeline</StyledText>
          <Slider
            step={1}
            maximumValue={allDates.length - 1}
            onSlidingComplete={(value) => setDate(allDates[value])}
            thumbTintColor={Colors.primary}
          />
          {console.log(allDates)}
          <StyledText>{currDate}</StyledText>
        </View>
      }
      {currRegion && 
        <View style={styles.timelineContainer}>
          <StyledText>Postcode {currRegion.postcode}</StyledText>
          {/* <StyledText>{formatArrayToCommaString(currRegion.includedAreas)} Region</StyledText> */}
          <View style={styles.regionDetailsContainer}>
            <View style={styles.regionDetailsStatContainer}>
              <StyledText style={styles.statsBoldText}>{getCasesForSetDate()}</StyledText>
              <StyledText>Cases</StyledText>
            </View>
            <View style={styles.regionDetailsStatContainer}>
              <StyledText style={styles.statsBoldText}>
                {Math.round(getCasesForSetDate() / getPopulation() * 10000) / 100}%
              </StyledText>
              <StyledText>of population infected</StyledText>
            </View>            
          </View>
        </View>
      }
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
  },
  timelineContainer: {
    width: "90%",
    opacity: 0.9,
    backgroundColor: "#fff",
    bottom: 0,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    padding: 20,
  },
  regionDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },  
  regionDetailsStatContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  statsBoldText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  timelineHeading: {
    fontWeight: "bold",
    fontSize: 20,
  }
});

export default SelfReportMapScreen;