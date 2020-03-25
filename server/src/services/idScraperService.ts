const checkSearchResults = "document.getElementById('search_results')?.childElementCount !== 0";

export const peelIDFromResultLinks = async (page: any) => {
  try {
    // this is ugly and wont be very performant when there are alot of pages to scrape
    // but i dont know how else to wait for the network to be idle
    await page.waitFor(1000);
    await page.waitForFunction(checkSearchResults);
  
    // grab the results from the table (this includes any inner html objects)
    // extract the id of the result with a regex expression and append the
    // id to the list on match
    const searchResultIds: string[] = await page.evaluate(() => {
      const linkIDRegex = /([0-9]+)<\/a>$/g;
      const searchResultsList = document.getElementById('search_results')?.children;
    
      if (searchResultsList) {
        const results = Array.from(searchResultsList).map((result) => {
          const getIdFromTitle = result.children[0].innerHTML.match(linkIDRegex);
          if (getIdFromTitle) {
            return getIdFromTitle[0].replace(/<\/a>/, '');
          } 
          return "";
        });
    
        return results;
      }
    
      return [];
    });
    return searchResultIds;
  } catch (error) {
    return [];
  }
};
