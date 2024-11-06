const { MongoClient } = require("mongodb");

async function insertBulkAuctions(db_client, auctions) {
  console.log(`${auctions.length} auctions scraped`);
  try {
    const db = db_client.db('propertypulse');
    const collection = db.collection('AuctionHouse');

    const existingLinks = await collection
      .find({ auctionLink: { $in: auctions.map(auction => auction.auctionLink) } })
      .project({ auctionLink: 1 })
      .toArray();

    const existingLinksSet = new Set(existingLinks.map(item => item.auctionLink));

    const newAuctions = auctions.filter(auction => !existingLinksSet.has(auction.auctionLink));

    if (newAuctions.length > 0) {
      const result = await collection.insertMany(newAuctions);
      console.log(`${result.insertedCount} new documents inserted`);
    }
    else
      console.log('No new auctions to insert');
  } catch (err) {
    console.error("Error inserting documents:", err);
  }
}

module.exports = {
  insertBulkAuctions
}