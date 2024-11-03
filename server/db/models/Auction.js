const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    address: {type: String, required: true},
    price: {type: String, required: true}
});

module.exports = mongoose.model('Auction', auctionSchema);
