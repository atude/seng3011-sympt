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
  const { isDiseasesOpen, setDiseasesOpen } = props;

  const handleSetListView = () => {
    setSearchTerm('');
    setIsListView(!isListView);
  };

  const handleClickOut = () => {
    setSearchTerm('');
    setDiseasesOpen(false);
  };
  
  return (
    <Overlay 
      isVisible={isDiseasesOpen}
      width={Layout.window.width}
      height={500}
      overlayStyle={{
        position: "absolute",
        bottom: 0,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
      }}
      windowBackgroundColor="transparent"
      onBackdropPress={() => handleClickOut()}
      animationType="slide"
    >
      <>
        <View style={styles.filterMenuContainer}>
          <Text style={styles.selectHeading}>
            Select Disease
          </Text>
          <TouchableOpacity
            onPress={() => handleSetListView()}
            style={[styles.listButton, { backgroundColor: isListView ? Colors.primary : Colors.secondary }]}
          >
            {!isListView ? 
              <View style={styles.listButtonContent}>
                <StyledText color="white">List View</StyledText>
                <MaterialCommunityIcons name="format-list-bulleted" style={styles.listSwitchIcon}/>
              </View>
              :
              <View style={styles.listButtonContent}>
                <StyledText color="white">Card View</StyledText>
                <MaterialCommunityIcons name="cards-variant" style={styles.listSwitchIcon}/>
              </View>
            }
          </TouchableOpacity>
        </View>
        {isListView ? 
          <>
            <Input 
              containerStyle={styles.termInput}
              onChangeText={(value) => setSearchTerm(value)}
              placeholder="Search for a disease"
              leftIcon={
                <MaterialCommunityIcons
                  name="magnify-plus-outline"
                  style={styles.inputSearchIcon}
                />
              }
            />
            <ScrollView>
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
          </>
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
      </>
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
  listSwitchIcon: {
    fontSize: 20,
    marginLeft: 7,
    marginTop: 1,
    color: "#fff",
  },  
  filterMenuContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
    padding: 10,
  },
  headingContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listButton: {
    borderRadius: 16,
    padding: 8,
    marginTop: -7,
    paddingHorizontal: 14,
    width: 130,
  },
  listButtonContent: {
    flexDirection: "row", 
    justifyContent: "space-between",
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
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 16,
    marginBottom: 5,
  }
});

export default DiseaseFilterMenu;