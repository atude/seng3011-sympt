import Colors from "../constants/Colors";

export const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: () => Colors.primary,
  barPercentage: 0.5,
  decimalPlaces: 0,
};

export const getHiddenPoints = (data) => {
  const hiddenPoints = data.map((point, i) => {
    if (!point) return i;
    return null;
  }).filter((point) => point);

  return hiddenPoints;
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