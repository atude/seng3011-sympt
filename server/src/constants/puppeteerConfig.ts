export default {
  headless: false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    // '--headless',
    '--single-process',
    '--disk-cache-size=0',
  ],
};
