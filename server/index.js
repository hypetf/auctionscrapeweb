
require('dotenv').config();
const express = require('express');
const app = express();
const { chromium } = require('playwright');
const { MongoClient } = require("mongodb");
const AuctionModel = require('./db/models/Auction')
const { connectToDatabase, closeDatabaseConnection } = require('./db/handshake');
const { insertBulkAuctions } = require('./db/insertBulkAuctions')
const { scrapeAuctionHouse } = require('./scrapers/auctionhouse')
const mongoURI = `mongodb+srv://rabbanikhan2001:${process.env.MONGODB_PW}@propertypulse.sb5xc.mongodb.net/`
const PORT = process.env.PORT || 3000;

const db_client = new MongoClient(mongoURI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000
});

connectToDatabase(db_client);
// const result = await scrapeAuctionHouse(db_client);
// res.json(result);
app.get('/scrape', async (req, res) => {
    
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const titleSelector = '.lot-search-result';

  try {
    await page.goto('https://www.auctionhouse.co.uk/manchester/auction/search-results');
    await page.waitForSelector(titleSelector);

    const data = await page.evaluate(() => {
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

    // const auctionPromises = cleanedData.map(async (item) => {
    //   const newAuction = new AuctionModel({
    //     title: item.address,
    //     price: item.price
    //   });
    //   return newAuction.save(); 
    // });

    // await Promise.all(auctionPromises);

    await insertBulkAuctions(db_client, cleanedData)
    console.log(`Scraped and inserted ${cleanedData.length} auctions`);
    res.json({ success: true, data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    await browser.close();
  }
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// OLD TEMPLATE
// <div class="col-sm-12 col-md-8 col-lg-6 text-center lot-search-result">
// <a class="home-lot-wrapper-link" href="/manchester/auction/lot/132840" target="" title="View property details">
// <div class="lot-search-wrapper grid-item">
// <div class="image-wrapper">
// <img alt="Property for Auction in Manchester - 3 Cheadle Street, Manchester, M11 1AG" class="lot-image" loading="lazy" src="/lot-image/686026"/>
// <div class="image-sticker lotbg-residential">
// 						Lot 1
// 					</div>
// </div>
// <div class="lotbg-residential text-white grid-view-guide">
// 				Sold £137,000
// 			</div>
// <div class="summary-info-wrapper">
// <p>2 Bed Terraced House</p>
// <p>3 Cheadle Street, Manchester, M11 1AG</p>
// </div>
// </div>
// </a>
// </div>

{/* <div class="col-sm-12 col-md-8 col-lg-6 text-center lot-search-result">
	<a href="/manchester/auction/lot/132840" class="home-lot-wrapper-link" title="View property details" target="">
		<div class="lot-search-wrapper grid-item rounded-lg overflow-hidden">
			
			<div class="image-wrapper position-relative">
					<img src="/lot-image/686026" class="lot-image" loading="lazy" alt="Property for Auction in Manchester - 3 Cheadle Street, Manchester, M11 1AG">
									<div class="image-sticker fw-semibold lotbg-residential">
						Lot 1
					</div>
			</div>
            <div class="fw-semibold lotbg-residential text-white grid-view-guide">
				Sold £137,000
			</div>
			<div class="summary-info-wrapper">
				<p class="fw-bold blue-text">2 Bed Terraced House</p>
				<p class="fw-medium blue-text">3 Cheadle Street, Manchester, M11 1AG</p>
			</div>
		</div>
	</a>
</div> */}