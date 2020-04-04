import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { CheckBox } from 'react-native-elements';

import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';

const SymptomsScreen = ({ navigation }) => {

  const description = "Select the symptoms relevant to your current medical condition.";
  const symptoms = [
    {id: '1', key: 'No symptoms'},
    {id: '2', key: 'Cough'},
    {id: '3', key: 'Throat irritation'},
    {id: '4', key: 'Fever'},
    {id: '5', key: 'Fatigue'},
    {id: '6', key: 'Shortness of breath'},
    {id: '7', key: 'Nausea'},
    {id: '8', key: 'Dizziness'},
    {id: '9', key: 'Headache'},
  ];

  const Item = ({ id, title, selected, onSelect }) => (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? Colors.primary : Colors.bg },
      ]}
    >
      <StyledText style={styles.title}>{title}</StyledText>
    </TouchableOpacity>
  );

  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected],
  );

  return (
    <View style={styles.container}>
      <StyledText style={styles.desc}>{description}</StyledText>
      <FlatList
        data={symptoms}
        renderItem={({ item }) => (
          <CheckBox style={styles.checklist}
            title={item.key}
            iconType='material'
            checkedIcon='check'
            uncheckedIcon='add'
            onPress={() => onSelect(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        extraData={selected}
      />
      <StyledButton
        color={"primary"}
        title={"Apply"}
        onPress={() => navigation.goBack()}
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