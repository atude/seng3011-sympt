import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import StyledText from './StyledText';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Input, Divider, ButtonGroup } from 'react-native-elements';

import diseases from '../constants/diseases.json';
import { FeedContext, DiseaseContext } from '../context/context';
import Layout from '../constants/Layout';

const defYPos = -600;

const FiltersSection = () => {
  const feedContext = useContext(FeedContext);
  const diseaseContext = useContext(DiseaseContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationIndex, setLocationIndex] = useState(feedContext.feedLocation === "Worldwide" ? 1 : 0);

  const [yPosAnim] = useState(new Animated.Value(defYPos));
  const [animDone, setAnimDone] = useState(true);

  useEffect(() => {
    Animated.timing(yPosAnim).stop();
    setAnimDone(false);

    if (feedContext.isFiltersOpen) {
      Animated.timing(yPosAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 600,
      }).start();
    } else {
      Animated.timing(yPosAnim, {
        useNativeDriver: true,
        toValue: defYPos,
        duration: 400,
      }).start(() => {
        setAnimDone(true);
      });    
    }
  }, [feedContext.isFiltersOpen]);

  const handleSetLocationIndex = (index) => {
    setLocationIndex(index);
    feedContext.setFeedLocation(index === 1 ? "Worldwide" : "Australia");
  };

  const renderKeyTermPill = (keyTerm) => {
    const isSelected = feedContext.keyTerms.includes(keyTerm);

    return (
      <TouchableOpacity 
        key={keyTerm} 
        onPress={() => 
          isSelected ?
            feedContext.removeKeyTerm(keyTerm) :
            feedContext.addKeyTerm(keyTerm)
        }
      >
        <View 
          style={[
            styles.keyTermPill, 
            isSelected ? 
              styles.keyTermPillSelected : 
              styles.keyTermPillUnselected
          ]}
        >
          <StyledText color={isSelected ? "white" : "primary"}>{keyTerm}</StyledText>
          <MaterialCommunityIcons 
            style={[styles.crossIcon, { color: isSelected ? "#fff" : Colors.primary }]} 
            name={isSelected ? "minus-circle" : "plus-circle"}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderBasePill = (diseaseName) => (
    <View style={[styles.keyTermPillBase, styles.keyTermPill]}>
      <StyledText color="white">{diseaseName}</StyledText>
    </View>
  );

  // Save rendering if not shown
  if (animDone && !feedContext.isFiltersOpen) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: yPosAnim }] }]}>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    width: Layout.window.width,
    position: "absolute",
    zIndex: 10000,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
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