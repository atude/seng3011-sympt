export const formatArrayToCommaString = (items) => {
  if (items && items.length) {
    const capitalised = items.map((item) => {
      return item.split(" ").map((word) => word ? word[0].toUpperCase() + word.substring(1) : "").join(" ");
    });
  
    return capitalised.reduce((a, b, i) => a + 
      (i === 0 ? "" : (i === items.length - 1 ? " & " : ", "))
       + b, "");
  }

  return "";
};