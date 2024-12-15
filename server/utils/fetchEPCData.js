const axios = require('axios');
const formatPostcode = require('./formatPostcode');
const Buffer = require('buffer').Buffer;
const govukKey = process.env.GOVUK_KEY;

async function fetchEPCData(postcode, address) {
    if(!address || !postcode)
        return "No postcode or address was provided."

    let formattedPostcode = formatPostcode(postcode);
    let formattedAddress = address.split(",")[0];
    const baseUrl = 'https://epc.opendatacommunities.org/api/v1/domestic/search';
    const base64Auth = Buffer.from(govukKey).toString('base64');

    let config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: `${baseUrl}?postcode=${formattedPostcode}&address=${formattedAddress}`,
        headers: { 
            'Accept': 'application/json', 
            'Authorization': `Basic ${base64Auth}`
        }
    };

    try {
        const res = await axios.request(config);
        if(!res.data)
            return `No data found for POSTCODE:${postcode}:ADDRESS:${formattedAddress}`
        // console.log(res.data)
        let data = {
            'lmk-key': res.data.rows[0]['lmk-key'],
            uprn: res.data.rows[0]['uprn'],
            postcode: res.data.rows[0]['postcode'],
            address: res.data.rows[0]['address'],
            'inspection-date': res.data.rows[0]['inspection-date'],
            'current-energy-rating': res.data.rows[0]['current-energy-rating'],
            'current-energy-efficiency': res.data.rows[0]['current-energy-efficiency'],
            'potential-energy-rating': res.data.rows[0]['potential-energy-rating'],
            'potential-energy-efficiency': res.data.rows[0]['potential-energy-efficiency']
        }

        return data;
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}

module.exports = fetchEPCData;
