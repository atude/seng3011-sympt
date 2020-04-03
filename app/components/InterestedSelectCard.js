import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import StyledText from './StyledText';
import Colors from '../constants/Colors';
// import { InterestedDiseaseContext } from '../context/context';
import { getDiseaseImage } from '../utils/mapDiseaseImages';

const InterestedSelectCard = (props) => {
  const {disease} = props;
  const [isSelected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!isSelected);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, {borderColor : isSelected ? Colors.primary : '#fff'}]}
      onPress={() => handleClick()}
    >
      <View style={styles.contentContainer}>
        <Image source={getDiseaseImage(disease.name)} style={styles.diseaseImage}/>
        <StyledText style={styles.title}>
          {disease.nameFormatted}
        </StyledText>
      </View>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 'auto',
    height: 40,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 3
  }, 
  contentContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: 'flex-start',
    height: "100%",
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    padding: 10,
  },
  diseaseImage: {
    width: 20,
    height: 20,
  },
});
  
export default InterestedSelectCard;