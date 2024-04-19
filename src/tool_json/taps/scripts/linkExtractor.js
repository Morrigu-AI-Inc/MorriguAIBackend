require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { promisify } = require('util');
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const bedrock = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIA2XAEOTXPJZVDOTQQ',
    secretAccessKey: '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',
  },
});

async function fetchAndParseHtml(url, selector) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const selectedElement = $(selector).html();

    if (!selectedElement) {
      throw new Error(`Element with selector '${selector}' not found`);
    }
    return selectedElement;
  } catch (error) {
    throw new Error(
      `Failed to fetch or parse HTML from ${url}: ${error.message}`,
    );
  }
}

async function generateSchemaForHtml(html, filename) {
  const input = {
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      system: `
        Extract the documentation links so we can extract all the information.
        The html block from the documentation will be provided, from which the links will be extracted.
        You are directly writing the extracted links to disk so please be careful.`,
      messages: [
        {
          role: 'user',
          content: html,
        },
        {
          role: 'assistant',
          content:
            'Extracting every single documentation link. const links = [',
        },
      ],
    }),
    contentType: 'application/json',
    accept: 'application/json',
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
  };

  const command = new InvokeModelCommand(input);
  try {
    const response = await bedrock.send(command);
    const schema = JSON.parse(new TextDecoder().decode(response.body))
      .content[0].text;
    console.log(schema);
    const outputPath = path.join(
      './links',
      `${path.basename(filename, '.html')}.json`,
    );
    await writeFile(outputPath, schema, { encoding: 'utf8' });
    console.log(`Schema for ${filename} saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error generating schema for ${filename}:`, error);
  }
}

async function processHtmlFromUrl(url, selector) {
  try {
    const html = await fetchAndParseHtml(url, selector);
    await mkdir('./generation', { recursive: true });
    const filename = url.split('/').pop() || 'index';
    await generateSchemaForHtml(html, filename);
  } catch (error) {
    console.error('Error processing HTML from URL:', error);
  }
}

async function processHtmlFromTextFile(filePath) {
  try {
    const htmlContent = await readFile(filePath, { encoding: 'utf8' });
    await mkdir('./generation', { recursive: true });
    const filename = path.basename(filePath, '.html');

    await generateSchemaForHtml(htmlContent, filename);
  } catch (error) {
    console.error('Error processing HTML from text file:', error);
  }
}

// const url = 'https://developers.pandadoc.com/reference'; // Replace with the actual URL
// const selector = '.Sidebar1t2G1ZJq-vU1.rm-Sidebar.hub-sidebar-content'; // CSS selector for the specific block
processHtmlFromTextFile('./htmlContent.txt');
