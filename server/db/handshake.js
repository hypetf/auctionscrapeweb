const { MongoClient } = require('mongodb');

async function connectToDatabase(db_client) {
    try {
    await db_client.connect();
    console.log("Connected to MongoDB");
    } catch (error) {
    console.error("MongoDB connection error:", error);
    }
}

async function closeDatabaseConnection(db_client) {
    try {
    await db_client.close();
    console.log("Disconnected from MongoDB");
    } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    }
}

module.exports = {
    connectToDatabase,
    closeDatabaseConnection,
};
