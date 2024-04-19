const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const { promisify } = require('util');
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
// AWS_ACCESS_KEY_ID=AKIA2XAEOTXPJZVDOTQQ
// AWS_SECRET_ACCESS_KEY=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
const bedrock = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIA2XAEOTXPJZVDOTQQ',
    secretAccessKey: '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',
  },
});

async function generateSchemaForHtml(html, filename) {
  const input = {
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      system: `
      We are writing schemas for Google Calendar API Integration. The AI's only understand JSON-Schemav7.
      You are writing JSON SCHEMA File Directly to disk so please be careful. Do not output anything other than JSON Schema.
      I'm extracting the JSON Schema from the HTML content of the file '${filename}'.
      Generate a JSON Schema for this HTML content from file '${filename}'. 

      Use The Following Format:

      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Title of the API endpoint", // this is to be filled in with the title of the API endpoint
        "description": "Description of the API endpoint", // this is to be filled in with the description of the API endpoint (be descriptive)
        "type": "object",
        "properties": {
          "endpoint": { // this is to be filled in with the endpoint schema
            "type": "string",
            "description": "API endpoint for joining a conversation",
            "value": "/v1/conversations/join" // this is to be filled in with the endpoint value
          },
          "method": { // this is to be filled in with the method schema
            "type": "string",
            "enum": [$METHOD],
            "description": "HTTP method used for the request"
          },
          "headers": { // this is to be filled in with the headers schema
            "type": "object",
            "properties": {
              "Authorization": {
                "type": "string",
                "description": "Bearer token for authentication"
              }
            },
            "required": ["Authorization"]
          },
          "contentType": { // this is to be filled in with the content type schema
            "type": "string",
            "enum": ["application/x-www-form-urlencoded", "application/json"],
            "description": "Content type of the request body"
          },
          "body": { // this is to be filled in with the request body schema
            "type": "object",
            "properties": {
            },
            "required": []
          },
          "queryParameters": { // this is to be filled in with the query parameters schema
            "type": "object",
            "properties": {
            },
            "required": []
          },
          "response": { // this is to be filled in with the response schema
            "type": "object",
            "properties": {
              
            },
            "required": []
          }
        },
        "required": ["endpoint", "method", "headers", "response"] // do not change this
        "additionalProperties": false // do not add any additional properties
      }

      ONLY OUTPUT JSON SCHEMA. DO NOT OUTPUT ANYTHING ELSE.`,
      messages: [
        {
          role: 'user',
          content: html,
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
    const schema = new TextDecoder().decode(response.body);
    console.log(JSON.parse(schema).content[0].text);
    const outputPath = path.join(
      './generation',
      `${path.basename(filename, '.html')}.json`,
    );
    await writeFile(
      outputPath,
      JSON.parse(schema)
        .content[0].text?.replace('```json', '')
        .replace('```', ''),
      {
        encoding: 'utf8',
      },
    );
    console.log(`Schema for ${filename} saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error generating schema for ${filename}:`, error);
  }
}

async function processHtmlFiles(directory) {
  try {
    const files = await readdir(directory);
    await mkdir('./generation', { recursive: true }); // Ensure the generation directory exists

    for (const file of files) {
      if (path.extname(file) === '.html') {
        // Ensure only .html files are processed
        const html = await readFile(path.join(directory, file), {
          encoding: 'utf8',
        });

        const $ = cheerio.load(html);
        const specificBlock = $.text();

        generateSchemaForHtml(specificBlock, file).then(() => {
          console.log(`Generated schema for ${file}`);
        });

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay to avoid rate limits
      }
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

const directoryPath = '../../../../../ai-taps/ai-taps-github/docs';
processHtmlFiles(directoryPath);
