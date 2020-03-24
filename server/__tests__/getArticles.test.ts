import admin from '../src/firebase/firebaseInit';
import { getArticles } from '../src/queryController';
import { isError } from '../src/utils/checkFunctions';
import { getDateObject } from '../src/utils/getDateObject';

console.log(`Admin init: ${!!admin}`);

jest.setTimeout(30000);


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
});
