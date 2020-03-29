export const parseKeyTerms = (keyterms) => {
    return keyterms.toString();
}

export const getCurrentTime = () => {
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    return dateTime.toISOString().split(".")[0];
}