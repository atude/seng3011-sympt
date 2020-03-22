import admin from '../src/firebase/firebaseInit';
import { getArticles } from '../src/queryController';

console.log(`Admin init: ${!!admin}`);

jest.setTimeout(30000);

describe("getArticles", () => {
    test("Check no articles", async () => {
      const query: string = "?startdate=2020-02-02T00:00:00&enddate=2020-02-02T00:00:00&location=china&keyterms=coronavirus&count=5&page=0";
      const articles = await getArticles(query);
      expect(articles).toStrictEqual([]);
    });
  });
  
