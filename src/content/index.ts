import { scrapeProductDetails } from './productReader';

if (!(window as any).__costPerUseScraperInitialized) {
  (window as any).__costPerUseScraperInitialized = true;

  // Listen for messages from the extension popup
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'scrapeProduct') {
      try {
        const result = scrapeProductDetails();
        sendResponse(result);
      } catch (error) {
        console.error('Cost Per Use scraper error:', error);
        sendResponse(null);
      }
      return true; // Keep message port open for asynchronous response
    }
    return false;
  });
}
