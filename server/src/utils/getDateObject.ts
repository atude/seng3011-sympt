export const getDateObject = (datestring: string | undefined) => {
  // datestring must be of the format 'yyyy-mm-dd hh:mm:ss'
  
  if (!datestring) {
    return null;
  }
  
  const dateTimeRegex = /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/g;
  
  const dateData = datestring.match(dateTimeRegex);
  
  if (dateData) {
    const [, year, month, day, hours, mins, secs] = "";
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 
      parseInt(day, 10), parseInt(hours, 10), parseInt(mins, 10), parseInt(secs, 10));
    return date;
  }
  return null;
};
