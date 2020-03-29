import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import { Text, Button } from '@ui-kitten/components';
import StyledCard from '../components/StyledCard';
import { UserContext, DiseaseContext } from '../context/context';

export default function HomeScreen() {
  const userContext = useContext(UserContext);
  const diseaseContext = useContext(DiseaseContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledCard>
        <Text>
          {userContext.user.email}
        </Text>
        <Text>
          {diseaseContext.diseaseName}
        </Text>
        <Button onPress={() => diseaseContext.setDisease("mers")}>
          Change to mers app wide 
        </Button>
      </StyledCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
});
