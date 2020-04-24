
// Get color linearly based on amount
export const getRegionColorByCases = (cases) => {
  let gValue = 255;
  if (cases >= 1000) {
    return [`rgba(255, 0, 72, 0.6)`, `rgba(255, 0, 72, 1)`];
  }
  if (cases < 1000) gValue = 30;
  if (cases < 100) gValue = 50;
  if (cases < 50) gValue = 80;
  if (cases < 40) gValue = 100;
  if (cases < 30) gValue = 130;
  if (cases < 20) gValue = 160;
  if (cases < 10) gValue = 200;
  if (cases < 5) gValue = 240;
  if (cases == 0) return [`rgba(0, 190, 0, 0.35)`, `rgba(0, 230, 0, 1)`];


  return [`rgba(190, ${gValue}, 0, 0.35)`, `rgba(240, ${gValue}, 0, 1)`];
};

// Get color based on relation to population
// export const getRegionColorByPercentage = (cases) => {
//   if (cases )
// };
