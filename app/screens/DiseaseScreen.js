import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import { DiseaseContext } from '../context/context';
import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import { LineChart } from "react-native-chart-kit";
import Layout from '../constants/Layout';
import { Picker } from 'react-native';
import { getDiseaseCases } from '../functions/diseaseFunctions';

// temp data
const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43 ,20],
      color: () => Colors.secondary, // optional
    }
  ],
};

const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: () => Colors.primary,
  barPercentage: 0.5,
};

const ActivityScreen = () => {
  const diseaseContext = useContext(DiseaseContext);
  const [loading, setLoading] = useState(true);
  const [diseasesAu, setDiseasesAu] =  useState([]);
  const [timeRangeIndex, setTimeRangeIndex] = useState(0);


  const fetchDiseases = async () => {
    setLoading(true);
    const diseaseCount = await getDiseaseCases(diseaseContext.disease.name, "AUSYTD");
    setLoading(false);
    console.log(diseaseCount);
  };

  useEffect(() => {
    fetchDiseases();
  }, [diseaseContext.disease]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledCard>
        <View style={styles.detailsContainer}>
          <StyledText color="secondary" style={styles.casesHeading}>Cases in Australia</StyledText>
          <View style={styles.casesContainer}>
            <Text>
              <StyledText style={styles.casesCountText}>60</StyledText>
              <StyledText>{` cases`}</StyledText>
              <StyledText color="grey">{` in the `}</StyledText>
            </Text>
            <Picker
              mode="dropdown"
              selectedValue={timeRangeIndex}
              style={styles.rangePicker}
              onValueChange={(itemValue) => setTimeRangeIndex(itemValue)}
            >
              <Picker.Item label="past day" value={0} />
              <Picker.Item label="past week" value={1} />
              <Picker.Item label="past month" value={2} />
              <Picker.Item label="past year" value={3} />
              <Picker.Item label="past decade" value={4} />
            </Picker>
          </View>
        </View>
        <LineChart
          data={data}
          width={Layout.window.width - 60}
          height={260}
          style={{
            marginLeft: -14,
          }}
          chartConfig={chartConfig}
          bezier
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
  detailsContainer: {
    padding: 6,
    marginBottom: 20,
  },
  casesContainer: {
    flex: 1,
    flexDirection: "row",
  },
  rangePicker: { 
    height: 50, 
    width: 150, 
    color: Colors.dull,
    fontFamily: "main",

    marginTop: -5.5,
    marginLeft: -8,
  },
  casesHeading: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  casesCountText: {
    fontSize: 24,
    fontWeight: "bold",
  }
});

export default ActivityScreen;
