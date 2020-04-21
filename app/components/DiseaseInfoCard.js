import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';
import { getDiseaseImage } from '../utils/mapDiseaseImages';
import StyledCard from './StyledCard';
import TabBarIcon from '../components/TabBarIcon';

const DiseaseInfoCard = (props) => {
  const { disease } = props;

  const [collapsed, setCollapsed] = useState(false);

  const infoCard = () => {
    return (
      <StyledCard>
        <View style={styles.contentContainer}>
          <Image source={getDiseaseImage(disease.name)} style={styles.diseaseImage}/>
          <View style={styles.headerContainer}>
            <StyledText style={styles.heading}>
              {disease.nameFormatted}
            </StyledText>
            <StyledText style={styles.body}>
              {disease.description}
            </StyledText>
          </View>
          <StyledText link={disease.link}>
            Find out more
          </StyledText>
        </View>
        <TouchableOpacity 
          style={styles.collapseTouchable} 
          onPress={() => setCollapsed(!collapsed)}
        >
          <TabBarIcon 
            style={styles.collapseIcon} 
            name="arrow-up-drop-circle-outline" 
          />
        </TouchableOpacity>
      </StyledCard>
    );
  };

  const collapsedInfoCard = () => {
    return (
      <StyledCard>
        <Image source={getDiseaseImage(disease.name)} style={styles.diseaseImageCollapsed}/>
        <TouchableOpacity style={styles.collapseTouchable} onPress={() => setCollapsed(!collapsed)}>
          <TabBarIcon 
            style={styles.collapseIcon} 
            name={"arrow-down-drop-circle-outline"} 
          />
        </TouchableOpacity>
      </StyledCard>
    );
  };

  return (
    <View >
      {(collapsed) ? collapsedInfoCard(): infoCard()}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
  },  
  contentContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    padding: 10,
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 10,
    height: 100,
  },
  diseaseImage: {
    width: 100,
    height: 100,
  },
  diseaseImageCollapsed: {
    width: 40,
    height: 40,
  }, 
  collapseTouchable: {
    position: "absolute", 
    top: 22, 
    right: 20,
  },
  collapseIcon: {
    fontSize: 30,
  },
});

export default DiseaseInfoCard;