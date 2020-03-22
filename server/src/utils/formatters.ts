/* eslint-disable no-restricted-globals */
import generateError from "./generateError";
import { GenError, URLFormattedTerms } from "../types";

export const dateRegexWords = /\d{1,2} [a-zA-Z]{3} \d{4}/gi;
export const dateRegexNum = /^([0-9]{4})-([0-9]{2})-([0-9]{2}).*/;

export const getNormalisedDate = (dateString: string): Date => new Date(`${dateString} UTC`);

export const formatDateToExact = (dateString: string) => {
  const dateRaw = getNormalisedDate(dateString);
  return dateRaw.toISOString().split("T")[0];
};

export const formatQueryUrl = (queryUrl: string): GenError | URLFormattedTerms => {
  const urlParams = new URLSearchParams(queryUrl);
  const keyTerms = urlParams.get('keyterms');
  const startDate = urlParams.get('startdate');
  const endDate = urlParams.get('enddate');
  const location = urlParams.get('location');
  const count: number | null = urlParams.get('count') ? Number(urlParams.get('count')) : null;
  const page: number | null = Number(urlParams.get('page'));

  if (!startDate) {
    return generateError(403, "Bad Request", "No specified start date");
  } if (!endDate) {
    return generateError(403, "Bad Request", "No specified end date");
  } if (isNaN(Number(count)) || (count && (count <= 0 || count > 10))) {
    return generateError(403, "Bad Request", "Count must be a number between 0 and 10");
  } if (isNaN(page) || page < 0 || (page && urlParams.get('count') === null)) {
    return generateError(403, "Bad Request", "Page must be a positive number or 0, and count must be specified");
  }

  // Compare the startdate submitted with the regex
  const startDateGroups = startDate.match(dateRegexNum);
  let [, startYear, startMonth, startDay] = "";
  if (startDateGroups) {
    [, startYear, startMonth, startDay] = startDateGroups;
  } else {
    return generateError(403, "Bad Request", "Invalid start date");
  }

  // Compare the enddate submitted with the regex
  const endDateGroups = endDate.match(dateRegexNum);
  let [, endYear, endMonth, endDay] = "";
  if (endDateGroups) {
    [, endYear, endMonth, endDay] = endDateGroups;
  } else {
    return generateError(403, "Bad Request", "Invalid end date");
  }

  return {
    startDate: `${startMonth}/${startDay}/${startYear}`,
    endDate: `${endMonth}/${endDay}/${endYear}`,
    keyTerms: keyTerms?.toLowerCase().split(',').filter((keyterm) => keyterm !== ""),
    location: location || "",
    count,
    page,
  } as URLFormattedTerms;
};
