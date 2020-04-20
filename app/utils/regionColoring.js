
// Get color linearly based on amount
export const getRegionColorByCases = (cases) => {
  let gValue = 255;
  if (cases < 1000) gValue = 0;
  if (cases < 100) gValue = 40;
  if (cases < 50) gValue = 90;
  if (cases < 20) gValue = 140;
  if (cases < 10) gValue = 180;
  if (cases < 5) gValue = 230;
  if (cases == 0) return [`rgba(0, 190, 0, 0.4)`, `rgba(0, 230, 0, 1)`];


  return [`rgba(190, ${gValue}, 0, 0.4)`, `rgba(240, ${gValue}, 0, 1)`];
};

// Get color based on relation to population
// export const getRegionColorByPercentage = (cases) => {
//   if (cases )
// };
