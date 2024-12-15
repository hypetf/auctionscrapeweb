const { chromium } = require('playwright');
const fetchEPCData = require('../utils/fetchEPCData');
// const { insertBulkAuctions } = require('../db/insertBulkAuctions');

const scrapeAuctionHouse = async (db_client) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const titleSelector = '.lot-search-result';
  let auctionData = [];

  try {
    await page.goto('https://www.auctionhouse.co.uk/manchester/auction/search-results');
    await page.waitForSelector(titleSelector);

    auctionData = await page.evaluate(() => {
      const listings = Array.from(document.querySelectorAll('.lot-search-result'));
    
      return listings.map(listing => {
        const auctionLink = listing.querySelector('a.home-lot-wrapper-link')?.href || 'No Link Provided';
        const imageSrc = listing.querySelector('.lot-image')?.src || 'No Image Provided';
        
        let price = 'No Price Provided';
        const onlineElement = listing.querySelector('.lotbg-online');
        const residentialElements = listing.querySelectorAll('.lotbg-residential');
        const commercialElements = listing.querySelectorAll('.lotbg-commercial');
        let propertyType = 'No Property Type specified';
        if (onlineElement) {
          price = onlineElement.innerText.trim();
          propertyType = "Online";
        } else if (residentialElements.length > 1) {
          price = residentialElements[1].innerText.trim();
          propertyType = "Residential";
        } else if (commercialElements.length > 1) {
          price = commercialElements[1].innerText.trim();
          propertyType = "Commercial";
        }
        
        const title = listing.querySelector('.summary-info-wrapper p.fw-bold')?.innerText.trim() || 'No Title Provided';
        const address = listing.querySelector('.summary-info-wrapper p.fw-medium')?.innerText.trim() || 'No Address Provided';
        
        return {
          auctionLink,
          imageSrc,
          propertyType,
          title,
          address,
          price
        }
      });
    });
    
    const cleanedData = await Promise.all(auctionData.map(async auction => {
      const cleanedPriceString = auction.price.replace(/\s+/g, ' ').trim();
      const cleanedPrice = cleanedPriceString.match(/[\d,.]+/) ? parseFloat(cleanedPriceString.match(/[\d,.]+/)[0].replace(/,/g, '')) : null;
      const postcodeRegex = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/;
      const match = auction.address.match(postcodeRegex);
      const postcode = match ? match[0] : 'No Postcode';
      const epcData = await fetchEPCData(postcode, auction.address);

      return {
        auctionLink: auction.auctionLink,
        imageSrc: auction.imageSrc,
        propertyType: auction.propertyType,
        title: auction.title,
        address: auction.address,
        postcode: postcode,
        price: cleanedPriceString,
        cleanedPrice: cleanedPrice,
        EPC_Data: epcData,
        timeOfScrape: Date.now()
      };
    }));

    // await insertBulkAuctions(db_client, cleanedData);
    return { success: true, data: cleanedData };

  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  } finally {
    await browser.close();
  }
};

module.exports = {
  scrapeAuctionHouse
};
