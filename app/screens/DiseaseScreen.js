import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import { DiseaseContext } from '../context/context';
import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import { LineChart } from "react-native-chart-kit";
import Layout from '../constants/Layout';
import { Picker } from 'react-native';
import { getDiseaseCases } from '../functions/diseaseFunctions';
import { getLastWeekArray, getLastMonthQuarterSplitArray, getLastYearArray, getLastDecadeArray } from '../utils/dateFunctions';

// temp data
const data = {
  labels: ["Jan", "Apr", "Jul", "Oct"],
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
  const [diseasesCount, setDiseasesCount] = useState([]);
  
  const [dataWeek, setDataWeek] = useState([]);
  const [dataMonth, setDataMonth] = useState([]);
  const [dataYear, setDataYear] = useState([]);
  const [dataDecade, setDataDecade] = useState([]);

  const [timeRangeIndex, setTimeRangeIndex] = useState(0);


  const fetchDiseases = async () => {
    setLoading(true);

    const currDate = new Date().toUTCString();

    const diseaseCount = await getDiseaseCases(diseaseContext.disease.nameDb, "AUSYTD");
    setDiseasesCount(diseaseCount);
    console.log(getLastWeekArray(currDate));
    console.log(getLastMonthQuarterSplitArray(currDate));
    console.log(getLastYearArray(currDate));
    console.log(getLastDecadeArray(currDate));


    // process to day, week, month, year etc

    setLoading(false);
    console.log(diseaseCount);
  };

  useEffect(() => {
    fetchDiseases();
  }, [diseaseContext.disease]);

  if (loading) return <ActivityIndicator />;

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
              <Picker.Item label="past week" value={0} />
              <Picker.Item label="past month" value={1} />
              <Picker.Item label="past year" value={2} />
              <Picker.Item label="past decade" value={3} />
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
          // bezier
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
