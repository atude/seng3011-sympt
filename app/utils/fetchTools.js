export const getFetchMeta = (key) => { 
  return {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      authorization: key,
    }
  };
};

export const parseKeyTerms = (keyterms) => {
  return keyterms.toString();
};

export const getCurrentTime = () => {
  const dateTime = new Date();
  dateTime.setTime(dateTime.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
  return dateTime.toISOString().split(".")[0];
};

export const formatTime = (datetime) => {
  datetime.setTime(datetime.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
  return datetime.toISOString().split(".")[0];
};