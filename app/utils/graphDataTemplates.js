import Colors from "../constants/Colors";

export const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: () => Colors.primary,
  barPercentage: 0.5,
  decimalPlaces: 0,
};

export const getHiddenPoints = (data) => {
  return data.map((point, i) => {
    console.log(point);
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