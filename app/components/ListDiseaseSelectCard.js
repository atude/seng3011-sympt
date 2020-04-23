import React, { useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import StyledText from './StyledText';
import Colors from '../constants/Colors';
import {DiseaseContext } from '../context/context';
import { getDiseaseImage } from '../utils/mapDiseaseImages';

const ListDiseaseSelectCard = (props) => {
  const {disease, setDiseaseOpen, setSearchTerm} = props;
  const diseaseContext = useContext(DiseaseContext);

  const handleClick = async () => {
    diseaseContext.setDisease(disease.name);
    setSearchTerm('');
    try {
      await AsyncStorage.setItem('disease', disease.name);
      console.log(`--> successfully set disease storage for ${disease.name}`);
    } catch (error) {
      console.log('--> could not set storage for disease');
    }
    setDiseaseOpen(false);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, {borderColor : diseaseContext.disease.name === disease.name ? Colors.primary : Colors.dull}]}
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
    borderRadius: 10,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 5,
    borderWidth: 1
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
    width: 28,
    height: 28,
    marginLeft: -5,
  },
});
  
export default ListDiseaseSelectCard;