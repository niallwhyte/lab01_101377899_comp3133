const fs = require('fs');
const csv = require('csv-parser');
const csvWriter = require('csv-write-stream');

function filterAndWriteData(country, outputFileName) {
    const outputData = [];

    fs.createReadStream('input_countries.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row.country === country) {
                outputData.push(row);
            }
        })
        .on('end', () => {
            const writer = csvWriter();
            writer.pipe(fs.createWriteStream(outputFileName));
            outputData.forEach((data) => writer.write(data));
            writer.end();

            console.log(`Filtered data for ${country} has been written to ${outputFileName}`);
        });
}

function deleteIfExists(fileName) {
    try {
        fs.unlinkSync(fileName);
        console.log(`File ${fileName} deleted successfully`);
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
    }
}

deleteIfExists('canada.txt');
deleteIfExists('usa.txt');

filterAndWriteData('Canada', 'canada.txt');

filterAndWriteData('United States', 'usa.txt');
