import React, { useEffect, useState, useRef, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Image, Switch, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import MapView from 'react-native-maps';
import { Keyboard } from 'react-native';

import nswPostcodesCoords from '../constants/nswPostcodesCoords.json';
import nswPopulation from '../constants/nswPopulation.json';
import nswSuburbs from '../constants/nswSuburbs.json';

import { getAllCasesNswRegions } from '../functions/nswDataFunctions';
import StyledText from '../components/StyledText';
import { formatArrayToCommaString } from '../utils/textFunctions';
import { Slider, Input, Overlay } from 'react-native-elements';
import { getRegionColorByCases } from '../utils/regionColoring';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { formatDateToDayMonthMap } from '../utils/dateFunctions';
import Layout from '../constants/Layout';
import StyledButton from '../components/StyledButton';
import { generatePredictions } from '../utils/getPrediction';
import { UserPostcodeContext } from '../context/context';

const predictionsDays = 30;

const SelfReportMapScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [nswData, setNswData] = useState([]);
  const [currRegion, setRegion] = useState(null);
  const [initialDateIndex, setInitialDateIndex] = useState();
  const [isSocialDistancing, setSocialDistancing] = useState(false);
  const [currDate, setDate] = useState();
  const [allDates, setAllDates] = useState([]);
  const [search, setSearch] = useState("");
  const mapRef = useRef(null);
  const [isHiding, setHiding] = useState(false);
  const [showInfoPage, setShowInfoPage] = useState(false);
  const userPostcodeContext = useContext(UserPostcodeContext);

  const handleSetRegion = (regionData) => {
    setRegion(regionData);
    setSearch("");
    Keyboard.dismiss();
    mapRef.current.fitToCoordinates(
      regionData.mapBoundaries,
      {
        edgePadding: {
          top: 50,
          bottom: 300,
          left: 200,
          right: 200,
        },
        animated: true,
      }
    );
  };

  const fetchData = async () => {
    setLoading(true);

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

        // console.log(casesArray);
        const casesCompiled = generatePredictions(predictionsDays, casesArray, population);

        return {
          postcode: region.properties.POA_NAME16,
          cases: casesCompiled,
          mapBoundaries: pointsArray,
          population,
          includedAreas,
        };
      })
      .filter((dataSet) => dataSet);
    
    setNswData(nswCombinedSet);

    const todaysDateFormatted = formatDateToDayMonthMap(new Date());
    setDate(todaysDateFormatted);

    const datesArray = nswCombinedSet[0].cases.map((regionCases) => {
      return regionCases.Date.replace("-", " ");
    });
    setInitialDateIndex(datesArray.findIndex((date) => date === todaysDateFormatted));
    setAllDates(datesArray);
    setTimeout(() => handleSetRegion(nswCombinedSet.find((dataSet) => dataSet.postcode == userPostcodeContext.userPostcode)), 3000);
    setLoading(false);
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
      if (isSocialDistancing && regionDataCases.NumberDistancing) {
        return regionDataCases.NumberDistancing;
      }
      return regionDataCases.Number;
    }
  };

  const getPopulation = () => {
    return nswPopulation.find((area) => area.POA_NAME16 == currRegion.postcode).Tot_p_p;
  };

  const cancelRegionSelection = () => {
    setRegion(null);
    setSearch("");
  };

  useEffect(() => {
    if (!nswData.length) {
      console.log("--> Fetching...");
      fetchData();
    }
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
          if (isSocialDistancing && regionDataCases.NumberDistancing) {
            regionDataCases = regionDataCases.NumberDistancing;
          } else {
            regionDataCases = regionDataCases.Number;
          }
        }
        
        const colorIntensity = getRegionColorByCases(regionDataCases);

        return (
          <MapView.Polygon
            key={i}
            coordinates={regionPointsArray}
            tappable={true}
            onPress={() => handleSetRegion(regionData)}
            fillColor={colorIntensity[0]}
            strokeWidth={regionData === currRegion ? 5 : 2}
            strokeColor={colorIntensity[1]}
          />
        );
      })
    );
  };

  if (loading) {
    return <ActivityIndicator 
      size={60}
      style={styles.loading} 
      colors={[Colors.primary, Colors.secondary]}
    />;
  }

  const renderLegend = (numCases) => {
    if (numCases == 0) {
      return <StyledText style={{ backgroundColor: getRegionColorByCases(numCases), textAlign: 'center'}}>
        {numCases} cases
      </StyledText>;
    } else {
      return <StyledText style={{backgroundColor: getRegionColorByCases(numCases - 1), textAlign: 'center'}}>
        {"<"} {numCases} cases
      </StyledText>;
    }
  };

  return (
    <View pointerEvents="box-none">
      <MapView 
        style={styles.map} 
        ref={mapRef}
        showsUserLocation={true}
        initialRegion={{
          latitude: -33.8688,
          longitude: 151.2093,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {renderRegions()}
      </MapView>
      <View style={styles.container} pointerEvents="box-none">
        {!isHiding && 
          <View style={styles.topSection} pointerEvents="box-none">
            <View style={styles.timelineContainer}>
              <Input
                placeholder="Search by suburb, city"
                onChangeText={(value) => setSearch(value)}
                value={search}
                leftIcon={
                  <MaterialCommunityIcons
                    name="magnify"
                    style={styles.inputSearchIcon}
                  />
                }
                rightIcon={
                  <TouchableOpacity onPress={() => cancelRegionSelection()}>
                    <MaterialIcons
                      name="cancel"
                      style={styles.inputSearchIcon}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            {search.length > 0 && 
              <View style={styles.timelineContainer}>
                {nswSuburbs.data.filter((area) => 
                  area.suburb.toLowerCase().includes(search.toLowerCase())
                ).splice(0, 5).map((area, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.searchSuburbResultContainer}
                    onPress={() => {
                      const foundSuburb = nswData.find((data) => data.postcode == area.postcode);
                      handleSetRegion(foundSuburb);
                    }}
                  >
                    <MaterialIcons 
                      name="location-on"
                      style={styles.searchSuburbResultIcon}
                    />
                    <StyledText 
                      style={styles.searchSuburbResult}
                    >
                      {area.suburb}, {area.postcode}
                    </StyledText>
                  </TouchableOpacity>
                ))
                }
              </View>
            }
          </View>
        }

        <View style={styles.botSection} pointerEvents="box-none">
          <View style={{
            flexDirection: "row",
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}>
            <StyledButton
              title={isHiding ? "Show Details" : "Hide Details"}
              buttonStyle={styles.hideToggle}
              onPress={() => setHiding(!isHiding)}
              type="solid"
            />
            <TouchableOpacity
              onPress={() => handleSetRegion(nswData.find((dataSet) => dataSet.postcode == userPostcodeContext.userPostcode))}
              style={{
                position: "absolute",
                right: 30,
              }}
            >
              <MaterialIcons
                name="my-location"
                style={{
                  fontSize: 28,
                  color: Colors.primary,
                  backgroundColor: "#fff",
                  padding: 10,
                  borderRadius: 100,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 10,
                }}
              />
            </TouchableOpacity>
          </View>
          {currRegion && !isHiding && 
            <View style={styles.timelineContainer}>
              <View style={styles.timelineTextContainer}>
                <StyledText>Postcode{" "}
                  <StyledText style={{fontWeight: "bold"}}>
                    {currRegion.postcode}
                  </StyledText>
                </StyledText>
                <View style={{flexDirection: "row"}}>
                  <TouchableOpacity onPress={() => setShowInfoPage(true)}>
                    <MaterialIcons
                      name="info"
                      style={styles.infoIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.regionDetailsContainer}>
                <View style={styles.regionDetailsStatContainer}>
                  <StyledText style={styles.statsBoldText}>{getCasesForSetDate()}</StyledText>
                  <StyledText>Cases</StyledText>
                </View>
                <View style={styles.regionDetailsStatContainer}>
                  <StyledText style={styles.statsBoldText}>
                    {Math.round(getCasesForSetDate() / getPopulation() * 10000) / 100}%
                  </StyledText>
                  <StyledText>of population in area infected</StyledText>
                </View>            
              </View>
              <StyledText>
                Area includes{" "}
                <StyledText style={{ fontWeight: "bold" }}>
                  {formatArrayToCommaString(currRegion.includedAreas)}
                </StyledText>
              </StyledText>
            </View>
          }
          {allDates.length > 0 && 
            <View style={styles.timelineContainer}>
              <View style={styles.timelineTextContainer}>
                <StyledText style={styles.timelineHeading}>Timeline</StyledText>
                <StyledText>
                  {initialDateIndex >= allDates.findIndex((date) => date === currDate) ?
                    currDate : (
                      <StyledText color="primary" style={{fontWeight: "bold"}}>
                        Predictions for <StyledText style={{fontWeight: "normal"}}>{currDate}</StyledText>
                      </StyledText>
                    )
                  } 
                </StyledText>
              </View>
              <Slider
                step={1}
                maximumValue={allDates.length - 1}
                value={allDates.findIndex((date) => date === currDate)}
                onValueChange={(value) => setDate(allDates[value])}
                thumbTintColor={Colors.primary}
              />
              <View style={styles.distancingSwitchContainer}>
                <View style={styles.distancingSwitchContainer}>
                  <MaterialIcons
                    name="people"
                    style={{
                      fontSize: 24,
                      marginRight: 10,
                    }}
                  />
                  <StyledText>Enable Social Distancing for Predictions</StyledText>
                </View>
                <Switch
                  value={isSocialDistancing}
                  onValueChange={() => setSocialDistancing(!isSocialDistancing)}
                  thumbColor={isSocialDistancing ? Colors.secondary : Colors.dull}
                />
              </View>
            </View>
          }
        </View>
      </View>
      <Overlay
        isVisible={showInfoPage}
        overlayStyle={styles.infoContainerStyle}
        onBackdropPress={() => setShowInfoPage(false)}
        animationType="fade"
      >
        <ScrollView>
          <View style={styles.legend}>
            <StyledText style={styles.infoTitle}>
              Legend
            </StyledText>
            {renderLegend(0)}
            {renderLegend(5)}
            {renderLegend(10)}
            {renderLegend(20)}
            {renderLegend(30)}
            {renderLegend(40)}
            {renderLegend(50)}
            {renderLegend(100)}
            {renderLegend(1000)}
            {renderLegend(10000)}
            <StyledText style={styles.infoTitle}>
              Data Sources
            </StyledText>
            <View style={styles.sourceContainer}>
              <Image style={styles.sourceImgs} source={require('../assets/images/sources/nsw-health.png')}/>
              <Image style={styles.sourceImgs} source={require('../assets/images/sources/nndss.png')}/>
            </View>
            <StyledText style={styles.infoTitle}>
              Predictions 
            </StyledText>
            <StyledText>
              {"Sympt's"} data is collected from Australian government sources, 
              including the NNDSS, NSW Gov Health, ABS and Data.NSW
              {"\n\n"}
              Statistics and future predictions are projected using the SIR equation 
              model using current information for NSW regions and analysis on the
              growth of COVID-19 across Australia.
            </StyledText>
          </View>
        </ScrollView>
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    position: "absolute",
    height: Layout.window.height - 180,
  },
  topSection: {
    flex: 0.5,
  },  
  botSection: {
    flex: 1,
    justifyContent: "flex-end",
  },  
  map: {
    width: Layout.window.width,
    height: Layout.window.height,
  },
  timelineContainer: {
    marginTop: 8,
    width: "90%",
    opacity: 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignSelf: "center",
    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  regionDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
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
  },
  timelineTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputSearchIcon: {
    marginLeft: -15,
    marginRight: 5,
    fontSize: 26,
    color: Colors.dull
  },
  searchSuburbResultContainer: {
    padding: 3,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  searchSuburbResult: {
    fontSize: 18,
  },
  searchSuburbResultIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  infoIcon: {
    fontSize: 22,
  },
  hideToggle: {
    flex: 1,
    alignSelf: "center",
    padding: 20,
    opacity: 0.9
  },
  loading: {
    alignSelf: "center",
    height: "100%",
  },
  infoContainerStyle: {
    borderRadius: 10,
  },
  sourceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceImgs: {
    height: 75,
    resizeMode: "contain",
  },
  legend: {
    padding: 15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoTitle: {
    paddingVertical: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  distancingSwitchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SelfReportMapScreen;