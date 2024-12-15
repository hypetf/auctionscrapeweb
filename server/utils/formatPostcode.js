function formatPostcode(postcode) {
    const regex = /^([A-Z]{1,2}[0-9]{1,2}[A-Z]?)\s?([0-9][A-Z]{2})$/i;
    const match = postcode.trim().toUpperCase().match(regex);

    if (match)
        return match[1] + match[2];
    else
        return "";
}

module.exports = formatPostcode