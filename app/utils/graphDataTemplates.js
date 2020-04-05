import Colors from "../constants/Colors";

export const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: () => Colors.primary,
  barPercentage: 0.5,
  decimalPlaces: 0,
};

export const freqChartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: (opacity) => {
    if (isNaN(opacity)) {
      return `rgba(47, 160, 200, 0.15)`;
    }
    return `rgba(47, 160, 200, ${opacity})`;
  },
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5
};

export const getHiddenPoints = (data) => {
  return data.map((point, i) => {
    if (point === 0.0001) return i;
    return null;
  });
};

// temp data
export const formatDataWeek = ({ data, dates }) => {
  return {
    labels: dates || [],
    datasets: [
      {
        data: data || [],
        color: () => Colors.secondary,
      }
    ],
  };
};