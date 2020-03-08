// Examples

/*

// Example request from firestore

const getUsername = async (userId: string) => {
  // --> Usually you would also test for authentication
  // here before calling the function, i.e. the function
  // should receive some sort of authentication token here which
  // your firebase admin account can verify that the client
  // is authenticated
  // <--

  // --> How to fetch a doc from firebase
  try {
    // Admin is who has access to firebase
    // Reference firestore and get the document you need
    // Make sure to await since its async call
    const getTestUserDocument = await admin
      .firestore()
      .doc(`users/${userId}`)
      .get();

    // Convert the document into usable data
    const testUserUsername = getTestUserDocument.data();
    return testUserUsername?.username;
  } catch (error) {
    throw new Error(error);
  }
};

*/

/*

const puppeteer = require("puppeteer");


--> Heres an example of some basic puppeteer interactions
    We start by opening a headless instance of chrome (without the GUI)
    and wait for the page to load. We then navigate to the promed search page.
    We find then find the input html element with id=searchterm and input our search query.
    Create a DOM variable containing the submit button and click it.
    Hit the submit button.
    We wait for the page to load and then take a screen shot.
const startPuppeteer = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  await page.goto("https://promedmail.org/promed-posts/");
  await page.$eval(
    "#searchterm",
    (el: { value: string }) => (el.value = "coronavirus")
  );
  const submitButton = await page.$(
    'form[name="as_form"] input[type="submit"]'
  );
  await submitButton.click();
  // await page.click('input[type="submit"]');
  await page.waitFor(10000);
  await page.screenshot({ path: "test.png" });
  console.log("Screenshotted");
  // other actions...
  await browser.close();
};
*/

/*

--> Heres an example of filtering through a firestore collection
    and getting top 10 usernames in ascending order
    and mapping into an array

const usersCollection = await admin
  .firestore()
  .collection("users")
  .where("username", ">=", args.username.toLowerCase())
  .orderBy("username", "asc")
  .limit(10)
  .get();
const usersDocs = usersCollection.docs.map((doc) => doc.data());

*/
