function DiseaseStringComparator(a, b) {
  let comparison = 0;
  if (a.name > b.name) {
    comparison = 1;
  } else if (a.name < b.name) {
    comparison = -1;
  }
  return comparison;
}

export default DiseaseStringComparator;