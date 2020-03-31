import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';

import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeedScreen from '../screens/FeedScreen';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Overlay } from 'react-native-elements';
import StyledText from '../components/StyledText';
import Layout from '../constants/Layout';

// TODO: In future versions, the diseases file can be fetched from the backend
import diseases from '../constants/diseases.json';
import DiseaseSelectCard from '../components/DiseaseSelectCard';

const BottomTab = createBottomTabNavigator();
const defaultRouteName = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  const [isDiseasesOpen, setDiseasesOpen] = useState(false);

  navigation.setOptions({ 
    headerTitle: getHeaderTitle(route),
    headerTitleStyle: {
      fontWeight: "bold",
      fontFamily: "sfpro",
      fontSize: 28,
      marginLeft: 10,
      marginTop: 18,
    },
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      height: 120,
      backgroundColor: "#fff",
    },
    headerRight: () => (
      <TouchableOpacity 
        onPress={() => setDiseasesOpen(true)}
        style={{
          marginTop: 20,
          marginRight: 14,
          padding: 10,
        }}
      >
        <TabBarIcon name="filter-outline"/>
        {/* Dummy overlay for fade bg effect */}
        <Overlay
          isVisible={isDiseasesOpen}
          fullScreen
          animationType="fade"
          height={0}
          width={0}
          overlayBackgroundColor="transparent"
        >
        </Overlay>

        <Overlay 
          isVisible={isDiseasesOpen}
          width={Layout.window.width}
          height={340}
          // borderRadius={20}
          overlayStyle={{
            position: "absolute",
            bottom: 0,
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          }}
          windowBackgroundColor="transparent"
          onBackdropPress={() => setDiseasesOpen(false)}
          animationType="slide"
        >
          <View>
            <StyledText style={styles.selectHeading}>
              Select Disease
            </StyledText>
            <ScrollView
              horizontal
              decelerationRate={"fast"}
              snapToAlignment="start"
              snapToInterval={Layout.window.width}
            >
              {diseases.map((disease, i) => (
                <DiseaseSelectCard
                  key={i}
                  style={{ width: "100%" }}
                  setDiseasesOpen={setDiseasesOpen}
                  diseaseName={disease.name}
                  diseaseNameFormatted={disease.nameFormatted}
                  diseaseDescription={disease.description}
                  last={i === diseases.length - 1}
                />
              ))}
            </ScrollView>
          </View>
        </Overlay>
      </TouchableOpacity>
    )
  });

  return (
    <BottomTab.Navigator 
      initialRouteName={defaultRouteName}
      tabBarOptions={{ style: {
        height: 50,
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
              name="dna" 
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
            />
          )
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused} 
              name="account-circle-outline" 
            />
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

const getHeaderTitle = (route) => {
  const routeName = route.state?.routes[route.state.index].name ?? defaultRouteName;

  switch (routeName) {
  case 'Activity':
    return 'Activity';
  case 'Feed':
    return 'Your Feed';
  case 'Profile':
    return 'Profile';
  }
};

const styles = StyleSheet.create({
  selectHeading: {
    fontWeight: "bold",
    fontFamily: "sfpro",
    fontSize: 28,
    padding: 24,
  }
});
