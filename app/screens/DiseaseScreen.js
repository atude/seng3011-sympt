import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import StyledCard from '../components/StyledCard';
import { DiseaseContext } from '../context/context';
import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';
import { LineChart, ContributionGraph } from "react-native-chart-kit";
import Layout from '../constants/Layout';
import { Picker } from 'react-native';
import { getDiseaseCases } from '../functions/diseaseFunctions';
import { 
  getLastWeekArray, 
  getLastMonthQuarterSplitArray, 
  getLastYearArray, 
  getLastDecadeArray, 
  formatDateToDayMonth,
  formatDateToMonthDay,
  formatDateToMonth,
  formatDateToYear,
  formatToString,
  getYesterday,
  getLastWeek,
} from '../utils/dateFunctions';
import { 
  formatDataWeek, 
  getHiddenPoints, 
  chartConfig, 
  freqChartConfig 
} from '../utils/graphDataTemplates';
import Svg, { Path, G } from 'react-native-svg';
import { nswPath, actPath, vicPath, saPath, ntPath, qldPath, tasPath, waPath } from '../constants/AuMapPaths';

const moment = require('moment');

const defDataObj = { data: [], dates: [] };
const graphMarginOffset = Layout.window.width / 8;
const timeRangeMap = {
  0: "day",
  1: "week",
  2: "month",
  3: "year",
};

const ActivityScreen = () => {
  const diseaseContext = useContext(DiseaseContext);
  const [loading, setLoading] = useState(true);
  const [dbName, setDbName] = useState("");
  
  const [dataWeek, setDataWeek] = useState(defDataObj);
  const [dataMonth, setDataMonth] = useState(defDataObj);
  const [dataYear, setDataYear] = useState(defDataObj);
  const [dataDecade, setDataDecade] = useState(defDataObj);
  const [casesDelta, setCasesDelta] = useState([0, 0, 0, 0]);

  const [selectedYtd, setSelectedYtd] = useState({ date: "", count: 0 });
  const [frequencyYtd, setFrequencyYtd] = useState([]);

  const [timeRangeIndex, setTimeRangeIndex] = useState(0);
  const [todaysDateFallbacked, setTodaysDateFallbacked] = useState(new Date());

  useEffect(() => {
    // Fetch on disease change
    if (diseaseContext.disease.nameDb !== dbName) {
      fetchDiseases();
      setDbName(diseaseContext.disease.nameDb);
    }
  }, [
    diseaseContext.disease.nameDb
  ]);

  const getCurrentGraph = () => {
    switch (timeRangeIndex) {
    case 0: return formatDataWeek(dataWeek);
    case 1: return formatDataWeek(dataMonth);
    case 2: return formatDataWeek(dataYear);
    case 3: return formatDataWeek(dataDecade);
    default: return formatDataWeek(dataWeek);
    }
  };

  const fetchDiseases = async () => {
    setLoading(true);

    const diseaseYtd = await getDiseaseCases(diseaseContext.disease.nameDb, "AUSYTD");
    const diseaseMonthly = await getDiseaseCases(diseaseContext.disease.nameDb, "AUS");

    if (!diseaseYtd || diseaseYtd.error) {
      setLoading(false);
      return { data: [null], dates: [] };
    }

    let currDate = new Date().toUTCString();
    setTodaysDateFallbacked(currDate);
    // Fallback to yesterday if todays data not in db yet
    if (!(formatToString(new Date()) in diseaseYtd)) {
      currDate = getYesterday(new Date()).toDate().toUTCString();
      setTodaysDateFallbacked(currDate);
    }
    const lastWeekArray = getLastWeekArray(currDate);
    const lastMonthArray = getLastMonthQuarterSplitArray(currDate);
    const lastYearArray = getLastYearArray(diseaseMonthly, currDate);
    const lastDecadeArray = getLastDecadeArray(diseaseYtd, currDate);

    const thisDataWeek = {
      data: lastWeekArray.map((thisDate) => {
        // Get change between each day
        const dataDay = diseaseYtd[thisDate];
        const dataDayBefore = diseaseYtd[formatToString(getYesterday(thisDate))];

        if (dataDayBefore !== undefined && dataDay !== undefined) {
          return dataDay - dataDayBefore;
        }
        return 0;
      }),
      dates: lastWeekArray.map((date) => formatDateToDayMonth(date)),
    };

    const thisDataMonth = {
      data: lastMonthArray.map((thisDate) => {
        const dataWeek = diseaseYtd[thisDate];
        const dataWeekBefore = diseaseYtd[formatToString(getLastWeek(thisDate))];

        if (dataWeekBefore !== undefined && dataWeek !== undefined) {
          return dataWeek - dataWeekBefore;
        }
        return 0;
      }),
      dates: lastMonthArray.map((date) => formatDateToMonthDay(date)),
    };

    const thisDataYear = {
      data: lastYearArray.map((thisDate) => diseaseMonthly[thisDate] ?? 0),
      dates: lastYearArray.map((date) => formatDateToMonth(date)),
    };

    const thisDataDecade = {
      data: lastDecadeArray.map((thisDate) => diseaseYtd[thisDate] ?? 0),
      dates: lastDecadeArray.map((date) => formatDateToYear(date)),
    };

    const currYear = new Date(currDate).getUTCFullYear();
    const frequencyData = Object.keys(diseaseYtd).map((key) => {
      return {
        date: key,
        count: diseaseYtd[key],
      };
    }).filter((countObj) =>  countObj.date.substr(0, 4) == currYear);

    setFrequencyYtd(frequencyData);
    setSelectedYtd(frequencyData.sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date))[0]
    );

    setDataWeek(thisDataWeek);
    setDataMonth(thisDataMonth);
    setDataYear(thisDataYear);
    setDataDecade(thisDataDecade);

    const thisCasesDelta = [
      thisDataWeek.data[thisDataWeek.data.length - 1] - thisDataWeek.data[0],
      thisDataMonth.data[thisDataMonth.data.length - 1] - thisDataMonth.data[0],
      thisDataYear.data[thisDataYear.data.length - 1] - thisDataYear.data[0],
      thisDataDecade.data[thisDataDecade.data.length - 1] - thisDataDecade.data[0],
    ];

    setCasesDelta(thisCasesDelta);
    setLoading(false);
  };

  if (loading) return (
    <ActivityIndicator 
      size={60}
      style={styles.loading} 
      colors={[Colors.primary, Colors.secondary]}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StyledCard>
        <View style={styles.detailsContainer}>
          <StyledText color="secondary" style={styles.casesHeading}>
            Rate of new cases in Australia
          </StyledText>
          <View style={styles.casesContainer}>
            <Text>
              <StyledText 
                style={styles.casesCountText} 
                color={casesDelta[timeRangeIndex] > 0 ? 
                  (casesDelta[timeRangeIndex] >= 100 ? "error" : "warning") : 
                  "secondary"
                }
              >
                {casesDelta[timeRangeIndex] > 0 ? 
                  `+${casesDelta[timeRangeIndex]}` : 
                  `${casesDelta[timeRangeIndex]}`
                }
              </StyledText>
              <StyledText 
                color={casesDelta[timeRangeIndex] > 0 ? 
                  (casesDelta[timeRangeIndex] >= 100 ? "error" : "warning") : 
                  "secondary"
                }>
                {` new cases per ${timeRangeMap[timeRangeIndex]} `}
              </StyledText>
            </Text>
            {/* <StyledText color="grey">{`\nsince the `}</StyledText> */}
            <Picker
              mode="dropdown"
              selectedValue={timeRangeIndex}
              style={styles.rangePicker}
              onValueChange={(itemValue) => setTimeRangeIndex(itemValue)}
            >
              <Picker.Item label="since the past week" value={0} />
              <Picker.Item label="since the past month" value={1} />
              <Picker.Item label="since the past year" value={2} />
              <Picker.Item label="since the past decade" value={3} />
            </Picker>
          </View>
        </View>
        <View style={styles.graphContainer}>
          <LineChart
            data={getCurrentGraph()}
            width={Layout.window.width - graphMarginOffset}
            height={260}
            chartConfig={chartConfig}
            verticalLabelRotation={timeRangeIndex >= 2 ? 40 : 0}
            xLabelsOffset={timeRangeIndex >= 2 ? -8 : 0}
            hidePointsAtIndex={getHiddenPoints(getCurrentGraph().datasets[0].data)}
            bezier={timeRangeIndex < 2}
            style={{ marginLeft: -10, }}
            fromZero
          />
        </View>
      </StyledCard>

      <StyledCard>
        <View style={styles.detailsContainer}>
          <StyledText color="secondary" style={styles.casesHeading}>
            Cases within states
          </StyledText>
        </View>
        <View style={styles.auMapContainer}>
          <Svg 
            height="100%" 
            width="100%"
            viewBox={`0 0 200 200`}
            preserveAspectRatio="xMinYMin slice" 
          >
            <G fill={Colors.secondary} stroke="#fff" strokeWidth="2.5">
              <Path d={nswPath} />
              <Path d={actPath} />
              <Path d={vicPath} />
              <Path d={saPath} />
              <Path d={ntPath} />
              <Path d={qldPath} />
              <Path d={tasPath} />
              <Path d={waPath} />
            </G>
          </Svg>
        </View>

      </StyledCard>
      
      <StyledCard>
        <View style={styles.detailsContainer}>
          <StyledText style={styles.casesHeading} color="primary">
            Total cases in Australia
          </StyledText>
          <Text>
            <StyledText 
              style={styles.casesCountText} 
            >
              {selectedYtd.count}
            </StyledText>
            <StyledText>
              {` cases this year up to `}
            </StyledText>
            <StyledText color="primary">
              {moment(selectedYtd.date).isSame(todaysDateFallbacked, 'd') ?
                `today`:
                moment(selectedYtd.date).format("MMMM Do")
              } 
            </StyledText>
          </Text>
          <View style={styles.graphContainer}>
            <ContributionGraph
              squareSize={Layout.window.width / 19.5}
              values={frequencyYtd}
              endDate={todaysDateFallbacked}
              numDays={90}
              width={Layout.window.width - graphMarginOffset}
              height={200}
              chartConfig={freqChartConfig}
              onDayPress={(currSquare) => currSquare.count && setSelectedYtd(currSquare)}
            />
          </View>
        </View>
      </StyledCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    padding: 24,
  }, 
  loading: {
    alignSelf: "center",
    height: "100%",
  },
  graphContainer: {
    alignSelf: "center",
    width: Layout.window.width - graphMarginOffset,
    alignItems: "center",
    marginLeft: -12,
  },  
  auMapContainer: {
    alignContent: "center",
    width: "100%",
    aspectRatio: 1,
    padding: 10,
  },
  detailsContainer: {
    padding: 6,
    marginBottom: 20,
  },
  casesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rangePicker: { 
    height: 50, 
    width: 220, 
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
