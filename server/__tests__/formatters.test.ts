import { formatQueryUrl } from '../src/utils/formatters';

describe("Testing query and date formatting", () => {
  test("Check bad/missing start date", () => {
    const queryMissing = "?enddate=2020-02-02T00:00:00";
    expect(formatQueryUrl(queryMissing)).toMatchObject({
      errorNo: 403, 
      errorName: "Bad Request", 
      errorMessage: "No specified start date.",
    });
    const queryBad = "?startdate=13-02T00:00:00&enddate=2020-02-02T00:00:00";
    expect(formatQueryUrl(queryBad)).toMatchObject({
      errorNo: 401, 
      errorName: "Bad Request", 
      errorMessage: "Invalid start date.",
    });
  });
});
