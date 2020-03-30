import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';
import Layout from '../constants/Layout';
import { DiseaseContext } from '../context/context';

const DiseaseSelectCard = (props) => {
  const diseaseContext = useContext(DiseaseContext);
  const { last, diseaseNameFormatted, diseaseName, diseaseDescription, setDiseasesOpen } = props;

  const handleClick = () => {
    setDiseasesOpen(false);
    diseaseContext.setDisease(diseaseName);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { marginRight: last ? 4 : 26 } ]}
      onPress={() => handleClick()}
    >
      <View style={styles.contentContainer}>
        <StyledText style={styles.heading}>
          {diseaseNameFormatted}
        </StyledText>
        <StyledText style={styles.body}>
          {diseaseDescription}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Layout.window.width - 34,
    height: 220,
    backgroundColor: "#fff",
    padding: 20,
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
  }, 
  contentContainer: {
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 24,
    padding: 10,
  },
  body: {
    fontSize: 16,
  }
});

export default DiseaseSelectCard;