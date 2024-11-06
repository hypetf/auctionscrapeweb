const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    // id: {type:}
    auctionLink: {
        type: String,
        required: false
    },
    imagesrc: {
        type: String,
        required: false
    },
    propertyType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    cleanPrice: {
        type: Number,
        required: false
    },
    timeOfScrape: {
        type: Date,
        required: true
    }
});

auctionSchema.index({ auctionLink: 1 }, {unique: true});

module.exports = mongoose.model('Auction', auctionSchema);