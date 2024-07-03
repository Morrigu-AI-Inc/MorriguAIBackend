const fs = require('fs');
const readline = require('readline');

// Input and output files
const inputFile =
  '/Users/jasonst.cyr/Developer/morrigu/backend/src/tool_json/taps/scripts/get_links/sObject Quick Action Default Values _ REST API Developer Guide _ Salesforce Developers.html';
const outputFile = './links.txt';

// Create a read stream and a write stream
const fileStream = fs.createReadStream(inputFile);
const outStream = fs.createWriteStream(outputFile);

// Use readline to read file line by line
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

// Regex to match URLs
// Regex to match URLs specifically starting with https://developer.salesforce.com/docs/
const urlRegex = /https:\/\/developer\.salesforce\.com\/docs\/[^\s]+/g;
// Set to store unique URLs
const uniqueLinks = new Set();

rl.on('line', (line) => {
  const links = line.match(urlRegex);
  if (links) {
    links.forEach((link) => {
      uniqueLinks.add(link);
    });
  }
});

rl.on('close', () => {
  uniqueLinks.forEach((link) => {
    outStream.write(link + '\n');
  });
  console.log('Finished extracting unique links.');
  outStream.close();
});
