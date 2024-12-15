require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require("mongodb");
const { connectToDatabase, closeDatabaseConnection } = require('./db/handshake');
const { scrapeAuctionHouse } = require('./scrapers/auctionHouse')
const { scrapePughAuctions } = require('./scrapers/pughAuctions')
const Auction = require('./db/models/Auction');
const fetchEPCData = require('./utils/fetchEPCData');
const mongoURI = `mongodb+srv://rabbanikhan2001:${process.env.MONGODB_PW}@propertypulse.sb5xc.mongodb.net/`
const PORT = process.env.PORT || 3001;

const db_client = new MongoClient(mongoURI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000
});

app.use(cors({
	origin: 'http://localhost:5173',
}));

connectToDatabase(db_client);

app.get('/scrape', async (req, res) => {
	const { target } = req.query;
	let result;
	try {
		if (target === 'pugh') {
			result = await scrapePughAuctions(db_client);
		} else if (target === 'auctionhouse') {
			result = await scrapeAuctionHouse(db_client);
	  	} else {
			return res.status(400).json({ error: 'Invalid target specified at /scrape' });
		}
		res.json(result);
	} catch (error) {
	  console.error('Error scraping:', error);
	  res.status(500).json({ error: 'An error occurred while scraping' });
	}
});

app.use((req, res) => {
	res.status(404).send('Page not found');
});

app.listen(PORT, async() => {
	console.log(`Server is running on http://localhost:${PORT}`);
	// let epcdata = await fetchEPCData("OL13 0RY", "28 Lord Avenue, Stacksteads, Rossendale, Lancashire, OL13 0RY");
	// console.log(epcdata)
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