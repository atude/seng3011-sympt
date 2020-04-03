import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import StyledText from '../components/StyledText';
import diseases from '../constants/diseases.json';
import DiseaseStringComparator from '../functions/diseaseStringComparator';
import InterestedSelectCard from '../components/InterestedSelectCard';
import SearchInput, { createFilter } from 'react-native-search-filter';
import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import Layout from '../constants/Layout';

const TagsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const diseaseCards = diseases.sort(DiseaseStringComparator).map((disease, i) => {
    return (
      <InterestedSelectCard
        key={i}
        disease={disease}
      />
    );
  });
  const filteredDiseases = diseaseCards.filter(createFilter(searchTerm, 'props.disease.name'));
  return (
    <ScrollView style={styles.container}>
      <StyledText style={styles.selectHeading}>
            Diseases Tags
      </StyledText>
      <Text style={styles.subtext}>
            Choose as many diseases as you would like. Related articles, news source and social media posts will appear in your feed.
      </Text>
      <View style={styles.searchWrapper}>
        <TabBarIcon name="magnify"/>
        <SearchInput 
          onChangeText={(term) => setSearchTerm(term)} 
          style={styles.searchInput}
          placeholder="Search for diseases"
          placeholderTextColor="black"
        />
      </View>      
      <View style={styles.resultsWrapper}>
        <ScrollView
          decelerationRate={"normal"}
          style={styles.menuContainer}
        >
          {filteredDiseases}
        </ScrollView>
      </View>
      <StyledText style={styles.selectHeading}>
          Location Tag
      </StyledText>
      <Text style={styles.subtext}>
          Toggle between an Australian or Global news.
      </Text>
      <View style={styles.locationsWrapper}>
        <View style={styles.iconWrapper}>
          <Switch 
            style={styles.locationSwitch} 
            trackColor={{ false: "#767577", true: "#c7f788" }}
            thumbColor={isEnabled ? "#65ad07" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}/>
          <Entypo 
            name='location-pin'
            style={styles.iconLocal}
            color={!isEnabled ? Colors.primary : Colors.dull }
          />
          <Entypo
            name='globe'
            style={styles.iconGlobal}
            color={isEnabled ? Colors.primary : Colors.dull }
          />
        </View>
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
    height:1000
  }, 
  selectHeading: {
    fontWeight: "bold",
    fontFamily: "main",
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 8,
  },
  menuContainer: {
    backgroundColor: '#cfcfcf',
    height: 200,
  },
  subtext: {
    fontFamily: "main",
    fontSize: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 8,
  },
  searchInput:{
    width: 280,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 10
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  resultsWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 16,
    backgroundColor: '#cfcfcf'
  },
  locationsWrapper: {
  },
  iconWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    textAlign: 'center',
    width: Layout.window.width-70,
  },
  locationSwitch: {
    paddingLeft: 10,
    marginRight: -10
  },
  iconLocal: {
    fontSize: 35,
  },
  iconGlobal: {
    fontSize: 35,
  }
});

export default TagsScreen;