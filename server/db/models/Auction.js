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
    postcode: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: true
    },
    cleanPrice: {
        type: Number,
        required: false
    },
    CURRENT_ENERGY_RATING: {
        type: String,
        required: false
    },
    WINDOWS_ENV_EFF: {
        type: String,
        required: false
    },
    timeOfScrape: {
        type: Date,
        required: true
    }
});

auctionSchema.index({ auctionLink: 1 }, {unique: true});

module.exports = mongoose.model('Auction', auctionSchema);