import React, { useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import { DiseaseContext } from '../context/context';
import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';

const ActivityScreen = () => {
  // const userContext = useContext(UserContext);
  const diseaseContext = useContext(DiseaseContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledCard>
        <StyledText>
          {diseaseContext.diseaseName}
        </StyledText>
        <StyledButton 
          color="primary"
          onPress={() => diseaseContext.setDisease("mers")} 
          title="yes"
        />
      </StyledCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
});

export default ActivityScreen;
