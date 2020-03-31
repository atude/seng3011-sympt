import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import { DiseaseContext } from '../context/context';
import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import { LineChart } from "react-native-chart-kit";
import Layout from '../constants/Layout';

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43 ,20],
      color: () => Colors.secondary, // optional
      strokeWidth: 2 // optional
    }
  ],
};

const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: () => Colors.primary,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5
};

const ActivityScreen = () => {
  // const userContext = useContext(UserContext);
  const diseaseContext = useContext(DiseaseContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledCard>
        <View style={styles.detailsContainer}>
          <StyledText color="secondary" style={styles.casesHeading}>Cases in Australia</StyledText>
          <Text>
            <StyledText style={styles.casesCountText}>60</StyledText>
            <StyledText>{` cases`}</StyledText>
            <StyledText color="grey">{` in the last 24 hours`}</StyledText>
          </Text>
        </View>
        <LineChart
          data={data}
          width={Layout.window.width - 60}
          height={260}
          style={{
            marginLeft: -14,
          }}
          chartConfig={chartConfig}
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
