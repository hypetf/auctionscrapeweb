const { MongoClient } = require("mongodb");

async function insertBulkAuctions(db_client, dataArray) {
    try {
      const db = db_client.db('propertypulse');
      const result = await db.collection('auctions').insertMany(dataArray);
      console.log(`${result.insertedCount} documents inserted`);
    } catch (err) {
      console.error("Error inserting documents:", err);
    }
}

module.exports = {
    insertBulkAuctions
}