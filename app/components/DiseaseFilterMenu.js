import React, { useState } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Overlay, Input } from 'react-native-elements';
import StyledText from '../components/StyledText';
import Layout from '../constants/Layout';
import DiseaseStringComparator from '../functions/diseaseStringComparator';

import diseases from '../constants/diseases.json';
import DiseaseSelectCard from '../components/DiseaseSelectCard';
import Colors from '../constants/Colors';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import ListDiseaseSelectCard from './ListDiseaseSelectCard';

const DiseaseFilterMenu = (props) => {
  const [isListView, setIsListView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {isDiseasesOpen, setDiseasesOpen} = props;

  const handleSetListView = () => {
    setSearchTerm('');
    setIsListView(!isListView);
  };
  return (
    <Overlay 
      isVisible={isDiseasesOpen}
      width={Layout.window.width}
      height={450}
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
      <View style={styles.filterMenuContainer}>
        <Text style={styles.selectHeading}>
              Select Disease
        </Text>
        <TouchableOpacity
          onPress={() => handleSetListView()}
          style={isListView ? styles.listButtonActive : styles.listButtonInactive}
        >
          <Text style={[styles.listButtonText, {color: isListView ? '#2988ab' : '#808080'}]}>
                List View
          </Text>
        </TouchableOpacity>
      </View>
      {isListView ? 
        <ScrollView>
          <Input 
            containerStyle={styles.termInput}
            onChangeText={(value) => setSearchTerm(value)}
            placeholder="Search for diseases"
            leftIcon={
              <MaterialCommunityIcons
                name="magnify-plus-outline"
                style={styles.inputSearchIcon}
              />
            }
          />
          <View style={styles.resultsWrapper}>
            <ScrollView
              decelerationRate={"normal"}
            >
              {diseases
                .filter((disease) => disease.name.includes(searchTerm.toLowerCase()))
                .length ? 
                diseases.filter((disease) => disease.name.includes(searchTerm.toLowerCase()))
                  .map((disease, i) => {
                    return (
                      <ListDiseaseSelectCard
                        key={i}
                        setDiseaseOpen={setDiseasesOpen}
                        disease={disease}
                        setSearchTerm={setSearchTerm}
                      />
                    );
                  })
                :
                <StyledText nofound>No diseases found</StyledText>
              }
            </ScrollView>
          </View>
        </ScrollView>
        : 
        <ScrollView
          horizontal
          decelerationRate={"fast"}
          snapToAlignment="start"
          snapToInterval={Layout.window.width}
        >
          {diseases.sort(DiseaseStringComparator).map((disease, i) => (
            <DiseaseSelectCard
              key={i}
              style={{ width: "100%" }}
              setDiseasesOpen={setDiseasesOpen}
              disease={disease}
              last={i === diseases.length - 1}
            />
          ))}
        </ScrollView>
      }
      
    </Overlay>
  );
};

const styles = StyleSheet.create({
  selectHeading: {
    paddingLeft: 10,
    height: 50,
    fontWeight: "bold",
    fontFamily: "main",
    fontSize: 28,
  },
  filterMenuContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 60,
  },
  headingContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listButtonActive: {
    height: 34,
    width: 80,
    backgroundColor: '#b0e2ff',
    borderColor: Colors.primary,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 4,
    marginLeft: 80
  },
  listButtonInactive: {
    height: 34,
    width: 80,
    borderColor: '#a8a8a8',
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    borderWidth: 2,
    marginTop: 4,
    marginLeft: 80

  },
  listButtonText: {
    padding: 5,
    fontFamily: "main",
    fontWeight: "bold",
    textAlign: "center"
  },
  termInput: {
    marginBottom: 10,
  }, 
  inputSearchIcon: {
    marginLeft: -10,
    marginRight: 5,
    fontSize: 26,
    color: Colors.dull
  },
  resultsWrapper: {
    flex: 1,
    width: Layout.window.width - 34,
    height: 295,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    marginLeft: 8,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    
    elevation: 8,
  }
});

export default DiseaseFilterMenu;