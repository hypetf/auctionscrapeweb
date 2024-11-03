const { chromium } = require('playwright');
const { insertBulkAuctions } = require('../db/insertBulkAuctions'); // Adjust the path as needed

const scrapeAuctionHouse = async (db_client) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const titleSelector = '.lot-search-result';
  let data = [];

  try {
    await page.goto('https://www.auctionhouse.co.uk/manchester/auction/search-results');
    await page.waitForSelector(titleSelector);

    data = await page.evaluate(() => {
      const listings = Array.from(document.querySelectorAll('.lot-search-result'));
    
      return listings.map(listing => {
        const address = listing.querySelector('.summary-info-wrapper')?.innerText.trim();
    
        const residentialElements = listing.querySelectorAll('.lotbg-residential');
        const onlineElements = listing.querySelectorAll('.lotbg-online');
    
        let price = 'No Price Provided';
    
        if (residentialElements.length > 1) {
          price = residentialElements[1]?.innerText.trim();
        } else if (onlineElements.length > 0) {
          price = onlineElements[0]?.innerText.trim();
        }
    
        return { address, price };
      });
    });
    
    const cleanedData = data.map(item => {
      const cleanedAddress = item.address
        ? item.address.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
        : 'No Address Provided';
      
      const cleanedPriceString = item.price
        ? item.price.replace(/\s+/g, ' ').trim()
        : 'No Price Provided';
      const cleanedPrice = cleanedPriceString.match(/[\d,.]+/) ? parseFloat(cleanedPriceString.match(/[\d,.]+/)[0].replace(/,/g, '')) : null;
      
      return {
        address: cleanedAddress,
        price: cleanedPriceString,
        cleanedPrice: cleanedPrice
      };
    });

    await insertBulkAuctions(db_client, cleanedData);
    console.log(cleanedData);
    return { success: true, data: cleanedData };

  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeAuctionHouse };
