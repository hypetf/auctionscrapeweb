const path = require('path');
const { chromium } = require('playwright');
const { loadCertificates } = require('../utils/loadCertificates');
// const { insertBulkAuctions } = require('../db/insertBulkAuctions');

const scrapePughAuctions = async (db_client) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const listingSelector = '.h-full.mb-8';
  let auctionData = [];

  const certificatesFilePath = path.resolve(__dirname, '../utils/certificates.csv');
  const certificates = await loadCertificates(certificatesFilePath);

  try {
    await page.goto('https://www.pugh-auctions.com/property-search?location=trafford&property-type=&radius=area&guide-price-from=0&guide-price-to=2000000&date-added=');
    await page.waitForSelector(listingSelector);

    auctionData = await page.evaluate(() => {
      const listings = Array.from(document.querySelectorAll('.h-full.mb-8'));

      return listings.map(listing => {
        const auctionLink = listing.querySelector('a.block')?.href || 'No Link Provided';
        const imageSrc = listing.querySelector('img')?.src || 'No Image Provided';
        const address = listing.querySelector('.px-4.flex-col a')?.innerText.trim() || 'No Address Provided';
        const priceText = listing.querySelector('span.text-xl.lg\\:text-2xl')?.innerText.trim() || 'No Price Provided';

        return {
          auctionLink,
          imageSrc,
          address,
          price: priceText,
        };
      });
    });

    const cleanedData = auctionData.map(auction => {
      const cleanedPriceString = auction.price.replace(/\s+/g, ' ').trim();
      const cleanedPrice = cleanedPriceString.match(/[\d,.]+/) ? parseFloat(cleanedPriceString.match(/[\d,.]+/)[0].replace(/,/g, '')) : null;
      const postcodeRegex = /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/;
      const match = auction.address.match(postcodeRegex);
      const postcode = match ? match[0] : 'No Postcode';

      const certificate = certificates.find(cert => cert.Postcode === postcode);
      const currentEnergyRating = certificate ? certificate.CURRENT_ENERGY_RATING : 'Not Found';
      const potentialEnergyRating = certificate ? certificate.POTENTIAL_ENERGY_RATING : 'Not Found';

      return {
        auctionLink: auction.auctionLink,
        imageSrc: auction.imageSrc,
        address: auction.address,
        postcode: postcode,
        price: cleanedPriceString,
        cleanedPrice: cleanedPrice,
        CURRENT_ENERGY_RATING: currentEnergyRating,
        POTENTIAL_ENERGY_RATING: potentialEnergyRating,
        timeOfScrape: Date.now()
      };
    });

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
  scrapePughAuctions
};
