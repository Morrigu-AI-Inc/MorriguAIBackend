const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const puppeteer = require('puppeteer');

const urls = [
  'authentication',
  'create-a-token',
  'patch-block-children',
  'retrieve-a-block',
  'get-block-children',
  'update-a-block',
  'delete-a-block',
  'post-page',
  'retrieve-a-page',
  'retrieve-a-page-property',
  'patch-page',
  'archive-a-page',
  'create-a-database',
  'post-database-query-filter',
  'post-database-query-sort',
  'post-database-query',
  'retrieve-a-database',
  'update-a-database',
  'update-property-schema-object',
  'get-users',
  'get-user',
  'get-self',
  'create-a-comment',
  'retrieve-a-comment',
  'post-search',
  'search-optimizations-and-limitations',
];

async function fetchAndSaveHtml(url, index) {
  const base = 'https://developers.notion.com/reference/';
  const fullUrl = `${base}${url}`;

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(fullUrl, {
  //   waitUntil: 'networkidle0',
  // });

  // page
  //   .content()

  axios
    .get(fullUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      },
      maxRedirects: 5, // Limit the number of redirects
    })
    .then((response) => {
      // .then((response) => {
      // const response = response.data;
      console.log('response', url);
      const $ = cheerio.load(response.data);
      const specificBlock = $('.rm-Article').text();
      console.log('specificBlock', specificBlock);
      if (specificBlock) {
        const modifiedUrl = url.replace(/\//g, '-');

        fs.writeFile(
          // `../tap-hubspot/docs/${modifiedUrl}.html`,
          // replace forward slashes with dashes
          `../../../../../ai-taps/ai-tap-notion/docs/${modifiedUrl}.html`,
          specificBlock,
          (err) => {
            if (err) {
              console.log(modifiedUrl);
              console.error('Error writing to file:', err);
            } else {
              console.log(
                `Successfully saved the HTML block from ${url} to ${modifiedUrl}.html`,
              );
            }
          },
        );
      } else {
        console.log(url);
        console.log(`The specified HTML block was not found in ${url}.`);
      }
    })
    .catch((error) => {
      console.error('Error fetching the page:', error);
    })
    .finally(() => {
      // Wait for 1 second before making the next request
      if (index < urls.length - 1) {
        setTimeout(() => fetchAndSaveHtml(urls[index + 1], index + 1), 300);
      }
    });
}

// Start the loop with the first URL
if (urls.length > 0) {
  fetchAndSaveHtml(urls[0], 0);
} else {
  console.log('No URLs provided.');
}
