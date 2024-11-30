const fs = require('fs');
const csvParser = require('csv-parser');

const loadCertificates = async (filePath) => {
    const certificates = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          certificates.push(row);
        })
        .on('end', () => resolve(certificates))
        .on('error', (err) => reject(err));
    });
};

module.exports = {
    loadCertificates
}