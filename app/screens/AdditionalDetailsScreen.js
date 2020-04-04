import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { CheckBox } from 'react-native-elements';

import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';

const AdditionalDetailsScreen = () => {

  const description = "Select the following statements that are applicable to you:";
  const questions = [
    {
      id: '1',
      title: 'I am a healthcare worker, aged care worker or residential care worker',
    },
    {
      id: '2',
      title: 'In the last 14 days, I have been in close contact with a person who has been diagnosed with an infectious disease',
    },
    {
      id: '3',
      title: 'I have undertaken international travel or been on a cruise ship in the 14 days before becoming unwell',
    },
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
      <StyledText style={styles.title}>{description}</StyledText>
      <FlatList
        data={questions}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            title={item.title}
            selected={!!selected.get(item.id)}
            onSelect={onSelect}
          />
        )}
        keyExtractor={item => item.id}
        extraData={selected}
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
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 30,
  },
  item: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
});

export default AdditionalDetailsScreen;