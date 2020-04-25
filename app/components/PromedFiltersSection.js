import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import StyledText from './StyledText';
import Colors from '../constants/Colors';

import { PromedFeedContext } from '../context/context';
import Layout from '../constants/Layout';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { formatTime } from '../utils/fetchTools';

// import { findCoords, getPostcodeFromCoords } from '../functions/locationFunctions';

const defYPos = -600;

const ProMedFiltersSection = () => {
  const feedContext = useContext(PromedFeedContext);

  const [yPosAnim] = useState(new Animated.Value(defYPos));
  const [animDone, setAnimDone] = useState(true);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
 
  // const getPostcode = async () => {
  //   const postcode = await getPostcodeFromCoords();
  //   console.log(postcode);
  // };

  const showDatePicker = (picker) => {
    picker == "start" ? setStartDatePickerVisibility(true) : setEndDatePickerVisibility(true);
  };
 
  const hideDatePicker = (picker) => {
    picker == "start" ? setStartDatePickerVisibility(false) : setEndDatePickerVisibility(false);
  };
 
  const handleStartConfirm = date => {
    hideDatePicker("start");
    const stringTime = formatTime(date);
    feedContext.setFeedStartDate(stringTime.split("T")[0]);
    // getPostcode();
  };

  const handleEndConfirm = date => {
    hideDatePicker("end");
    const stringTime = formatTime(date);
    feedContext.setFeedEndDate(stringTime.split("T")[0]);
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

  const renderPill = (text) => (
    <View style={styles.keyTermPill}>
      <StyledText color="white">{text}</StyledText>
    </View>
  );

  const renderDateModal = (type) => (
    <DateTimePickerModal
      isVisible={type == "start" ? isStartDatePickerVisible : isEndDatePickerVisible}
      mode="date"
      onConfirm={type == "start" ? handleStartConfirm: handleEndConfirm}
      onCancel={() => hideDatePicker(type)}
      display="calendar"
      maximumDate={type == "start" ? new Date() : new Date()}
    />
  );

  // Save rendering if not shown
  if (animDone && !feedContext.isFiltersOpen) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: yPosAnim }] }]}>
      <View style={styles.keyTermsContainer}>
        <StyledText style={styles.heading}>Start Date</StyledText>
        <TouchableOpacity onPress={() => showDatePicker("start")}>
          {renderPill(feedContext.feedStartDate)}
          {renderDateModal("start")}
        </TouchableOpacity>
      </View>
      <View style={styles.keyTermsContainer}>
        <StyledText style={styles.heading}>End Date</StyledText>
        <TouchableOpacity onPress={() => showDatePicker("end")}>
          {renderPill(feedContext.feedEndDate)}
          {renderDateModal("end")}
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
    fontWeight: "bold",
    fontSize: 18,
  },
  keyTermsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  keyTermPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 3,
    marginHorizontal: 3,

    backgroundColor: Colors.primary,
  },
});

export default ProMedFiltersSection;