import React, { useState, useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';

import ActivityScreen from '../screens/DiseaseScreen';
import FeedScreen from '../screens/FeedScreen';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Overlay } from 'react-native-elements';
import { DiseaseContext, FeedContext } from '../context/context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import DiseaseFilterMenu from '../components/DiseaseFilterMenu';
import StyledText from '../components/StyledText';
import Layout from '../constants/Layout';

const BottomTab = createBottomTabNavigator();
const defaultRouteName = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  const [isDiseasesOpen, setDiseasesOpen] = useState(false);
  const [currRoute, setCurrRoute] = useState(route.state?.routes[route.state.index].name ?? defaultRouteName);

  const diseasesContext = useContext(DiseaseContext);
  const feedContext = useContext(FeedContext);

  useEffect(() => {
    setCurrRoute(route.state?.routes[route.state.index].name);
  }, [route.state?.routes[route.state.index].name]);

  const getHeaderTitle = (route) => {
    const routeName = route.state?.routes[route.state.index].name ?? defaultRouteName;
  
    switch (routeName) {
    case 'Activity':
      return diseasesContext.disease.nameFormatted || "Activity";
    case 'Feed':
      return 'Your Feed';
    default:
      return diseasesContext.disease.nameFormatted;
    }
  };

  navigation.setOptions({ 
    headerTitle: getHeaderTitle(route),
    headerLeft: () => null,
    headerTitleStyle: {
      fontWeight: "bold",
      fontFamily: "main",
      fontSize: 28,
      marginLeft: 6,
      marginTop: 18,
    },
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      height: 130,
      backgroundColor: "#fff",
    },
    headerRight: () => (
      <>
        <View style={styles.headerButtonContainer}>
          <TouchableOpacity 
            onPress={() => setDiseasesOpen(true)}
            style={styles.headerButton}
          >
            <StyledText style={styles.headerText}>Change Disease</StyledText>
            <MaterialCommunityIcons 
              name="dna" 
              color="#fff"
              style={styles.headerIcon}
            />
          </TouchableOpacity>

          {/* Dummy overlay for fade bg effect */}
          
        </View>
        <Overlay
          isVisible={isDiseasesOpen}
          fullScreen
          animationType="fade"
          height={0}
          width={0}
          overlayBackgroundColor="transparent"
        >
          <Text/>
        </Overlay>
        <DiseaseFilterMenu 
          isDiseasesOpen={isDiseasesOpen} 
          setDiseasesOpen={setDiseasesOpen}
        />
      </>
    )
  });

  return (
    <>
      {currRoute === "Feed" &&
        <View style={styles.filtersButtonContainer}>
          <TouchableOpacity 
            onPress={() => 
              feedContext.setFiltersOpen(!feedContext.isFiltersOpen)
            }
            style={styles.filtersButton}
          >
            <StyledText color="primary">Search Filters</StyledText>
            <MaterialCommunityIcons 
              name={feedContext.isFiltersOpen ? "close-circle-outline" : "filter-outline"}
              color={Colors.primary} 
              style={{ fontSize: 24, marginTop: 2, marginLeft: 3}}
            />
          </TouchableOpacity>
        </View> 
      }
      <BottomTab.Navigator 
        initialRouteName={defaultRouteName}
        tabBarOptions={{ style: {
          height: 54,
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: "transparent",
        }}}
      >
        <BottomTab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon 
                focused={focused} 
                name="earth" 
                tabName="Disease Activity"
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon 
                focused={focused} 
                name="card-bulleted-outline" 
                tabName="News Feed"
              />
            )
          }}
        />
      </BottomTab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  selectHeading: {
    fontWeight: "bold",
    fontFamily: "main",
    fontSize: 28,
    padding: 24,
  },
  headerButtonContainer: {
    marginTop: 20,
    marginRight: 14,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  headerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    color: "#fff",
    marginTop: -2,
  },  
  headerIcon: {
    fontSize: 22,
    marginLeft: 3,
  },
  filtersButtonContainer: {
    backgroundColor: "#fff",
  },
  filtersButton: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },  
});
