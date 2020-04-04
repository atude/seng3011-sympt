import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Colors from '../constants/Colors';
import { CheckBox } from 'react-native-elements';

import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';
//import { getSymptoms } from '../functions/profileFunctions';

const SymptomsScreen = () => {

  // TODO:
  // click and un-click checkboxes
  // navigation - from profile and sign up pages
  // store data from user -> Apply

  const [checkbox, checked] = useState(null);

  useEffect(() => {

  });
  const description = "Select the symptoms relevant to your current medical condition.";
  const symptoms = [
    "Cough",
    "Throat irritation",
    "Fever",
    "Fatigue",
    "Shortness of breath",
    "Nausea",
    "Dizziness",
    "Headache",
    "No symptoms",
  ];
  /*
symptoms.map((symptom) => {
  return (
    <StyledText>{symptom}</StyledText>
  );
});

<CheckBox style={styles.checklist}
  title='Click Here'
/>
    <ScrollView contentContainerStyle={styles.container}>

onPress={() => handleSubmit()}
*/
  return (
    <View style={styles.container}>
      <StyledText style={styles.desc}>{description}</StyledText>
      <FlatList
        data={[
          {key: 'No symptoms'},
          {key: 'Cough'},
          {key: 'Throat irritation'},
          {key: 'Fever'},
          {key: 'Fatigue'},
          {key: 'Shortness of breath'},
          {key: 'Nausea'},
          {key: 'Dizziness'},
          {key: 'Headache'},
        ]}
        renderItem={({item}) => <CheckBox style={styles.checklist} title={item.key}/>}
      />
      <StyledButton
        color={"primary"}
        title={"Apply"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 30,
    flex: 1,
  },
  desc: {
    fontSize: 18,
    paddingBottom: 15,
  },
  checklist: {
    fontSize: 22,
    padding: 3,
  },
});

export default SymptomsScreen;