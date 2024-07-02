const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

const bedrock = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIA2XAEOTXPJZVDOTQQ',
    secretAccessKey: '8R2ewk/Ca+qc6aiD/tUIULYfDP3YQRcy1wbwPTFU',
  },
});

// Function to concatenate files
async function concatenateFiles(masterFile, exampleFile, realFile) {
  const dataMaster = await readFile(masterFile, 'utf8');
  const dataExample = await readFile(exampleFile, 'utf8');
  const dataReal = await readFile(realFile, 'utf8');
  return dataMaster + dataExample + dataReal;
}

// Function to send data to LLM and log response
async function sendDataToLLM(data, write_file_path) {
  const input = {
    body: JSON.stringify({
      // Define your input configuration
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      system: `
      We are writing schemas for SalesForce REST API Integration. The AI only understands JSON-Schemav7.
      You are writing JSON SCHEMA File Directly to disk so please be careful. Do not output anything other than JSON Schema.
      I'm extracting the JSON Schema from the HTML content of the file .
      Generate a JSON Schema for this HTML content from file . 

      This is the mandatory format for the JSON Schema:

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

      ONLY OUTPUT JSON SCHEMA. DO NOT OUTPUT ANYTHING ELSE.
      `,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: data,
            },
            {
              type: 'text',
              text: 'We are building a JSON Schema for the Salesforce REST API Integration. The AI only understands the format detailed in the system prompt in JSON-Schemav7.',
            },
          ],
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
    const wfp = path.join(write_file_path); // Update this path
    const schema = new TextDecoder().decode(response.body);
    

    await writeFile(
      wfp,
      JSON.parse(schema)
        .content[0].text?.replace('```json', '')
        .replace('```', ''),
      {
        encoding: 'utf8',
      },
    );

    
  } catch (error) {
    console.error('Error sending data to LLM:', error);
  }
}

// List of item names to process
const items = [
  'appSwitscher',
  'compactLayouts',
  'createAction',
  'describe',
  'flexiPage',
  'globalLayouts',
  'layouts',
  'limits',
  'menuSalesforce1',
  'objectDeleted',
  'objectGet',
  'objectPatch',
  'objectPostBody',
  'objectPostResponse',
  'objectsByFieldValue',
  'objectsByFieldValuePatchBody',
  'objectsByFieldValuePatchResponse',
  'objectsGet',
  'objectUpdated',
  'passwordExpiration',
  'passwordNew',
  'passwordReset',
  'query',
  'queryResults',
  'quickActionsPostBody',
  'recent',
  'resourceNotFoundByExternalId',
  'search',
  'searchLayout',
  'searchScopeOrder',
  'sobjects',
  'themes',
  'version',
  'versions',
];

// Main function to process the files
async function processFiles() {
  const masterFilePath = './Salesforce-master/salesforce.json'; // Update this path
  const baseDirectory = './Salesforce-master/schemas'; // Update this path
  const exampleDirectory = './Salesforce-master/examples'; // Update this path

  try {
    for (const item of items) {
      const exampleFile = path.join(exampleDirectory, item + '-example.json');
      const realFile = path.join(baseDirectory, item + '.json');
      const data = await concatenateFiles(
        masterFilePath,
        exampleFile,
        realFile,
      );
      await sendDataToLLM(
        data,
        './Salesforce-master/generation/' + item + '.json',
      );
    }
  } catch (error) {
    console.error('Error processing items:', error);
  }
}

processFiles();
