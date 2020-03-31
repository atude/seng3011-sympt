import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';
import Layout from '../constants/Layout';
import { DiseaseContext } from '../context/context';

const DiseaseSelectCard = (props) => {
  const diseaseContext = useContext(DiseaseContext);
  const { last, disease, setDiseasesOpen } = props;

  const handleClick = () => {
    setDiseasesOpen(false);
    diseaseContext.setDisease(disease.name);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { marginRight: last ? 4 : 26 } ]}
      onPress={() => handleClick()}
    >
      <View style={styles.contentContainer}>
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

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Layout.window.width - 34,
    height: 260,
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
  },
});

export default DiseaseSelectCard;