import React, { useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import StyledText from './StyledText';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Input, Divider, ButtonGroup } from 'react-native-elements';

import diseases from '../constants/diseases.json';
import { FeedContext, DiseaseContext } from '../context/context';

import Collapsible from 'react-native-collapsible';

const FiltersSection = () => {
  const feedContext = useContext(FeedContext);
  const diseaseContext = useContext(DiseaseContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationIndex, setLocationIndex] = useState(feedContext.feedLocation === "Worldwide" ? 1 : 0);

  const handleSetLocationIndex = (index) => {
    setLocationIndex(index);
    feedContext.setFeedLocation(index === 1 ? "Worldwide" : "Australia");
  };

  const renderKeyTermPill = (keyTerm) => {
    const isSelected = feedContext.keyTerms.includes(keyTerm);

    return (
      <View key={keyTerm} 
        style={[
          styles.keyTermPill, 
          isSelected ? 
            styles.keyTermPillSelected : 
            styles.keyTermPillUnselected
        ]}
      >
        <StyledText color={isSelected ? "white" : "primary"}>{keyTerm}</StyledText>
        <TouchableOpacity 
          onPress={() => 
            isSelected ?
              feedContext.removeKeyTerm(keyTerm) :
              feedContext.addKeyTerm(keyTerm)
          }
        >
          <MaterialCommunityIcons 
            style={[styles.crossIcon, { color: isSelected ? "#fff" : Colors.primary }]} 
            name={isSelected ? "minus-circle" : "plus-circle"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBasePill = (diseaseName) => (
    <View style={[styles.keyTermPillBase, styles.keyTermPill]}>
      <StyledText color="white">{diseaseName}</StyledText>
    </View>
  );

  return (
    <Collapsible collapsed={feedContext.isFiltersOpen}>
      <View style={styles.container}>
        <StyledText style={styles.heading}>Location</StyledText>
        <ButtonGroup
          containerStyle={styles.locationButtonContainer}
          textStyle={styles.locationButtonText}
          buttons={["Australia", "Worldwide"]}
          selectedIndex={locationIndex}
          selectedButtonStyle={styles.locationSelectedButton}
          onPress={(newIndex) => handleSetLocationIndex(newIndex)}
        />
        <StyledText style={styles.heading}>Search Terms</StyledText>
        <Input 
          containerStyle={styles.termInput}
          // autoFocus
          onSubmitEditing={() => feedContext.setFiltersOpen(false)}
          onChangeText={(value) => setSearchTerm(value)}
          placeholder="Search for diseases"
          leftIcon={
            <MaterialCommunityIcons
              name="magnify-plus-outline"
              style={styles.inputSearchIcon}
            />
          }
        />
        <View style={styles.keyTermsContainer}>
          {renderBasePill(diseaseContext.disease.nameFormatted)}
          {feedContext.keyTerms.map((keyTerm) => renderKeyTermPill(keyTerm))}
        </View>
        <Divider style={styles.keyTermsDivider} />
        <ScrollView 
          style={styles.keyTermsParentContainer}
          contentContainerStyle={styles.keyTermsContainer}
          scrollEventThrottle={1}
        >
          {diseases
            .filter((disease) => 
              disease.name.includes(searchTerm.toLowerCase()) && 
              !feedContext.keyTerms.includes(disease.nameFormatted) &&
              diseaseContext.disease.name !== disease.name
            )
            .length ? 
            diseases
              .filter((disease) => 
                disease.name.includes(searchTerm.toLowerCase()) && 
                !feedContext.keyTerms.includes(disease.nameFormatted) &&
                diseaseContext.disease.name !== disease.name
              )
              .map((disease) => renderKeyTermPill(disease.nameFormatted))
            :
            <StyledText nofound>No diseases found</StyledText>
          }
        </ScrollView>
      </View>
    </Collapsible>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },  
  heading: {
    paddingHorizontal: 10,
    paddingBottom: 12,
    fontWeight: "bold",
    fontSize: 18,
  },
  termInput: {
    marginBottom: 10,
  },  
  keyTermsParentContainer: {
    maxHeight: 240,
  },  
  keyTermsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  keyTermPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 3,
    marginHorizontal: 3,
  },
  keyTermPillBase: {
    backgroundColor: Colors.dull,
  },
  keyTermPillSelected: {
    backgroundColor: Colors.primary,
  },
  keyTermPillUnselected: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  crossIcon: {
    marginLeft: 6,
    marginTop: 1.5,
    fontSize: 20,
  },
  inputSearchIcon: {
    marginLeft: -10,
    marginRight: 5,
    fontSize: 26,
    color: Colors.dull
  },
  keyTermsDivider: {
    marginVertical: 10,
  },
  locationButtonContainer: {  
    borderRadius: 20,
    marginBottom: 24,
  },
  locationButtonText: {
    fontFamily: "main",
  },
  locationSelectedButton: {
    backgroundColor: Colors.secondary,
  }
});

export default FiltersSection;