export const formatArrayToCommaString = (items) => {
  const capitalised = items.map((item) => {
    return item.split(" ").map((word) => word[0].toUpperCase() + word.substring(1)).join(" ");
  });

  console.log(capitalised);

  return capitalised.reduce((a, b, i) => a + 
    (i === 0 ? "" : (i === items.length - 1 ? " & " : ", "))
     + b, "");
};