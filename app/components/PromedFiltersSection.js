import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import StyledText from './StyledText';
import Colors from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Input, Divider, ButtonGroup } from 'react-native-elements';

import { PromedFeedContext, DiseaseContext } from '../context/context';
import Layout from '../constants/Layout';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { formatTime } from '../utils/fetchTools';

const defYPos = -600;

const ProMedFiltersSection = () => {
  const feedContext = useContext(PromedFeedContext);
  const diseaseContext = useContext(DiseaseContext);

  const [yPosAnim] = useState(new Animated.Value(defYPos));
  const [animDone, setAnimDone] = useState(true);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
 
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
 
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
 
  const handleStartConfirm = date => {
    hideDatePicker();
    const stringTime = formatTime(date);
    feedContext.setFeedStartDate(stringTime);
  };

  const handleEndConfirm = date => {
    hideDatePicker();
    const stringTime = formatTime(date);
    feedContext.setFeedEndDate(stringTime);
    hideDatePicker();
  };

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
      <View style={styles.keyTermsContainer}>
        {renderBasePill("Australia")}
      </View>
      <Divider style={styles.keyTermsDivider} />
      <StyledText style={styles.heading}>Search Terms</StyledText>
      <View style={styles.keyTermsContainer}>
        {renderBasePill(diseaseContext.disease.nameFormatted)}
      </View>
      <Divider style={styles.keyTermsDivider} />
      <StyledText style={styles.heading}>Start Date</StyledText>
      <View style={styles.keyTermsContainer}>
        <TouchableOpacity onPress={showDatePicker}>
          <StyledText>Set start range</StyledText>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleStartConfirm}
            onCancel={hideDatePicker}
          />
        </TouchableOpacity>
      </View>
      <Divider style={styles.keyTermsDivider} />
      <StyledText style={styles.heading}>End Date</StyledText>
      <View style={styles.keyTermsContainer}>
        <TouchableOpacity onPress={showDatePicker}>
          <StyledText>Set end range</StyledText>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleEndConfirm}
            onCancel={hideDatePicker}
          />
        </TouchableOpacity>
      </View>
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
});

export default ProMedFiltersSection;