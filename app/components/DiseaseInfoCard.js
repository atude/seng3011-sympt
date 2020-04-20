import React, { useContext } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';
import { DiseaseContext } from '../context/context';
import { getDiseaseImage } from '../utils/mapDiseaseImages';
import Colors from '../constants/Colors';
import StyledCard from './StyledCard';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';

const DiseaseInfoCard = (props) => {
  const diseaseContext = useContext(DiseaseContext);
  const {disease} = props;

  const handleClick = () => {
    console.log("Closing");
  };


  return (
    <StyledCard style={[styles.container, {
      borderColor: diseaseContext.disease.name === disease.name ? 
        Colors.primary : 
        'transparent' 
    }]}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={() => handleClick()}>
          <TabBarIcon 
            name="arrow-down-drop-circle-outline" 
          />
        </TouchableOpacity>
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
    </StyledCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 350,
    backgroundColor: "#fff",
    borderWidth: 3,
    padding: 25,
    borderRadius: 16,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    
    elevation: 8,
  }, 
  headerContainer: {
    alignItems: "center",
  },  
  contentContainer: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
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
  collapseIcon: {

  }
});

export default DiseaseInfoCard;