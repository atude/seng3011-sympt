import { formatQueryUrl } from '../src/utils/formatters';

const overPageLimit = 11;

describe("Testing query and date formatting", () => {
  test("Check malformed/missing start date", () => {
    const queryMissing = "?enddate=2020-02-02T00:00:00";
    expect(formatQueryUrl(queryMissing)).toMatchObject({
      errorNo: 403, 
      errorName: "Bad Request", 
      errorMessage: "No specified start date",
    });
    const queryMissingYear = "?startdate=13-02T00:00:00&enddate=2020-02-02T00:00:00";
    expect(formatQueryUrl(queryMissingYear)).toMatchObject({
      errorNo: 403, 
      errorName: "Bad Request", 
      errorMessage: "Invalid start date",
    });
    const queryMissingMonthDay = "?startdate=2000-02T00:00:00&enddate=2020-02-02T00:00:00";
    expect(formatQueryUrl(queryMissingMonthDay)).toMatchObject({
      errorNo: 403, 
      errorName: "Bad Request", 
      errorMessage: "Invalid start date",
    });
  });
  test("Check malformed/missing end date", () => {
    const queryMissing = "?startdate=2020-02-02T00:00:00?location=china&keyterms=coronavirus";
    expect(formatQueryUrl(queryMissing)).toMatchObject({
      errorNo: 403, 
      errorName: "Bad Request", 
      errorMessage: "No specified end date",
    });
    const queryMissingYear = "?startdate=2000-02-02T00:00:00&enddate=02-02T00:00:00";
    expect(formatQueryUrl(queryMissingYear)).toMatchObject({
      errorNo: 403, 
      errorName: "Bad Request", 
      errorMessage: "Invalid end date",
    });
    const queryMissingMonthDay = "?startdate=2000-02-02T00:00:00&enddate=2002-02T00:00:00";
    expect(formatQueryUrl(queryMissingMonthDay)).toMatchObject({
      errorNo: 403, 
      errorName: "Bad Request", 
      errorMessage: "Invalid end date",
    });
  });
});

describe("Testing query and location", () => {
  test("Check no location", () => {
    const queryMissing = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00";
    // expect(formatQueryUrl(queryMissing)).toMatchObject({
    //   errorNo: 403, 
    //   errorName: "Bad Request", 
    //   errorMessage: "No specified location.",
    // });
    expect(formatQueryUrl(queryMissing)).toMatchObject({
      count: null, 
      endDate: "02/03/2020", 
      location: "",
      page: 0,
      startDate: "02/02/2020",
    });
  });
  test("Successful Location Input", () => {
    const caseInsensitive = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=China";
    expect(formatQueryUrl(caseInsensitive)).toMatchObject({
      count: null, 
      endDate: "02/03/2020", 
      location: "China",
      page: 0,
      startDate: "02/02/2020",
    });
  });
});

describe("Testing query and keyterms", () => {
  test("Check no keyterms", () => {
    const queryMissing = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china";
    expect(formatQueryUrl(queryMissing)).toMatchObject({
      count: null, 
      endDate: "02/03/2020", 
      location: "china",
      page: 0,
      startDate: "02/02/2020",
    });
  });
  test("One keyterm", () => {
    const oneKeyterm = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus";
    expect(formatQueryUrl(oneKeyterm)).toMatchObject({
      count: null, 
      endDate: "02/03/2020", 
      location: "china",
      keyTerms: ["coronavirus"],
      page: 0,
      startDate: "02/02/2020",
    });
  })
  test("Two keyterms", () => {
    const twoKeyterm = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus,sars";
    expect(formatQueryUrl(twoKeyterm)).toMatchObject({
      count: null, 
      endDate: "02/03/2020", 
      location: "china",
      keyTerms: ["coronavirus", "sars"],
      page: 0,
      startDate: "02/02/2020",
    });
  })
  test("Case Insensitive", () => {
    const caseInsensitive = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus,SARS";
    expect(formatQueryUrl(caseInsensitive)).toMatchObject({
      count: null, 
      endDate: "02/03/2020", 
      location: "china",
      keyTerms: ["coronavirus", "sars"],
      page: 0,
      startDate: "02/02/2020",
    });
  })
});

describe("Testing query and count", () => {
  test("No count", () => {
    const noCount = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus";
    expect(formatQueryUrl(noCount)).toMatchObject({
      count: null, 
      endDate: "02/03/2020", 
      location: "china",
      keyTerms: ["coronavirus"],
      page: 0,
      startDate: "02/02/2020",
    });
  });
  test("Count under limit", () => {
    const count = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus&count=2";
    expect(formatQueryUrl(count)).toMatchObject({
      count: 2, 
      endDate: "02/03/2020", 
      location: "china",
      keyTerms: ["coronavirus"],
      page: 0,
      startDate: "02/02/2020",
    });
  });
  test("Bad request: Count over limit", () => {
    const count = `?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus&count=${overPageLimit}`;
    expect(formatQueryUrl(count)).toMatchObject({
      errorMessage: "Count must be a number between 0 and 10",
      errorName: "Bad Request",
      errorNo: 403,
    });
  });
});

describe("Testing query and page", () => {
  test("No page", () => {
    const noCount = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus&count=2";
    expect(formatQueryUrl(noCount)).toMatchObject({
      count: 2, 
      endDate: "02/03/2020", 
      location: "china",
      keyTerms: ["coronavirus"],
      page: 0,
      startDate: "02/02/2020",
    });
  });
  test("Request with page", () => {
    const noCount = "?startdate=2020-02-02T00:00:00&enddate=2020-02-03T00:00:00&location=china&keyterms=coronavirus&count=2&page=3";
    expect(formatQueryUrl(noCount)).toMatchObject({
      count: 2, 
      endDate: "02/03/2020", 
      location: "china",
      keyTerms: ["coronavirus"],
      page: 3,
      startDate: "02/02/2020",
    });
  });
});