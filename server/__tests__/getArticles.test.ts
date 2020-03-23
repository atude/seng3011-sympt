import admin from '../src/firebase/firebaseInit';
import { getArticles } from '../src/queryController';
import { isError } from '../src/utils/checkFunctions';

console.log(`Admin init: ${!!admin}`);

jest.setTimeout(30000);


const getDateObject = (datestring: string | undefined) => {
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

describe("getArticles", () => {
  test("Check no articles", async () => {
    const query: string = "?startdate=2020-02-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=5&page=0";
    const articles = await getArticles(query);
    expect(articles).toStrictEqual([]);
  });
});

describe("Testing recieved articles | count operations", () => {
  test("Test count articles #1", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=1&page=0";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(1);
  });

  test("Test count articles #2", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=2&page=0";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(2);
  });

  test("Test count articles #3", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=4&page=0";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(4);
  });

  test("Test count articles #4", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=7&page=0";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(7);
  });

  test("Test count articles #5", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=7&page=0";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(7);
  });

  test("Test count articles #6", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=0&page=0";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(25);
  });

  test("Test count articles #7", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(25);
  });
});

describe("Testing recieved articles | page operations ", () => {
  test("Test page articles #1", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=10&page=0";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(10);
  });

  test("Test page articles #2", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=10&page=1";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(10);
  });

  test("Test page articles #3", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=5&page=2";
    const articles = await getArticles(query);
    expect(articles).toHaveLength(5);
  });
});


describe("Testing recieved articles | article ordered by date", () => {
  test("Test article order #1", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus";
    const articles = await getArticles(query);
    if (!isError(articles)) {
      let ordered = true;
      let currentDate = null;
      let previousDate = getDateObject(articles[0].date_of_publication);
      
      if (previousDate) {
        articles.forEach((article) => {
          currentDate = getDateObject(article.date_of_publication);
          if (currentDate && previousDate) {
            if (currentDate < previousDate) {
              ordered = false;
            }
            previousDate = currentDate;
          } else {
            ordered = false;
          }
        });
      } else {
        ordered = false;
      }

      expect(ordered).toBeTruthy();
    }
  });
  test("Test article order #2", async () => {
    const query: string = "?startdate=2019-12-01T00:00:00&enddate=2020-01-31T00:00:00&location=china&keyterms=coronavirus";
    const articles = await getArticles(query);
    if (!isError(articles)) {
      let ordered = true;
      let currentDate = null;
      let previousDate = getDateObject(articles[0].date_of_publication);
      
      if (previousDate) {
        articles.forEach((article) => {
          currentDate = getDateObject(article.date_of_publication);
          if (currentDate && previousDate) {
            if (currentDate < previousDate) {
              ordered = false;
            }
            previousDate = currentDate;
          } else {
            ordered = false;
          }
        });
      } else {
        ordered = false;
      }

      expect(ordered).toBeTruthy();
    }
  });

  test("Test article order #3", async () => {
    const query: string = "?startdate=2020-01-01T00:00:00&enddate=2020-03-01T00:00:00&location=china&keyterms=covid";
    const articles = await getArticles(query);
    if (!isError(articles)) {
      let ordered = true;
      let currentDate = null;
      let previousDate = getDateObject(articles[0].date_of_publication);
      
      if (previousDate) {
        articles.forEach((article) => {
          currentDate = getDateObject(article.date_of_publication);
          if (currentDate && previousDate) {
            if (currentDate < previousDate) {
              ordered = false;
            }
            previousDate = currentDate;
          } else {
            ordered = false;
          }
        });
      } else {
        ordered = false;
      }

      expect(ordered).toBeTruthy();
    }
  });
});


/*
describe("Testing recieved articles | query location valid", () => {
  test("Test query location #1", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=
      2020-02-02T00:00:00&location=china&keyterms=coronavirus";
    const articles = await getArticles(query);
    let includesQueryLocation = true;
    if (!isError(articles)) {
      articles.forEach((article) => {
        if (!article.main_text?.toLowerCase().includes("china")) {
          includesQueryLocation = false;
        }
      });
    }
    expect(includesQueryLocation).toBeTruthy();
  });

  test("Test query location #2", async () => {
    const query: string = "?startdate=2019-01-02T00:00:00&enddate=
      2020-02-02T00:00:00&location=india&keyterms=coronavirus";
    const articles = await getArticles(query);
    let includesQueryLocation = true;
    if (!isError(articles)) {
      articles.forEach((article) => {
        if (!article.main_text?.toLowerCase().includes("india")) {
          includesQueryLocation = false;
        }
      });
    }
    expect(includesQueryLocation).toBeTruthy();
  });

  test("Test query location #3", async () => {
    const query: string = "?startdate=2020-01-02T00:00:00&enddate=
      2020-02-02T00:00:00&location=australia&keyterms=coronavirus";
    const articles = await getArticles(query);
    let includesQueryLocation = true;
    if (!isError(articles)) {
      articles.forEach((article) => {
        if (!article.main_text?.toLowerCase().includes("australia")) {
          includesQueryLocation = false;
        }
      });
    }
    expect(includesQueryLocation).toBeTruthy();
  });

  test("Test query location #4", async () => {
    const query: string = "?startdate=2019-01-02T00:00:00&enddate=
      2020-02-02T00:00:00&location=italy&keyterms=coronavirus";
    const articles = await getArticles(query);
    let includesQueryLocation = true;
    if (!isError(articles)) {
      articles.forEach((article) => {
        if (!article.main_text?.toLowerCase().includes("italy")) {
          includesQueryLocation = false;
        }
      });
    }
    expect(includesQueryLocation).toBeTruthy();
  });

  test("Test query location #5", async () => {
    const query: string = "?startdate=2019-01-02T00:00:00&enddate=
      2020-02-02T00:00:00&location=europe&keyterms=coronavirus";
    const articles = await getArticles(query);
    let includesQueryLocation = true;
    if (!isError(articles)) {
      articles.forEach((article) => {
        if (!article.main_text?.toLowerCase().includes("europe")) {
          includesQueryLocation = false;
        }
      });
    }
    expect(includesQueryLocation).toBeTruthy();
  });
});
*/
