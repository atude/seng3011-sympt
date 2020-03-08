const generateError = (errorNo: number, errorName: string, errorMessage: string) => ({
  error: {
    errorNo,
    errorName,
    errorMessage,
  },
});

export default generateError;
