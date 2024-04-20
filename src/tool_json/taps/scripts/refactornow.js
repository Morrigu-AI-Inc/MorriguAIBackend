const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require('@aws-sdk/client-bedrock-runtime');
// import OpenAI from 'openai';
const { OpenAI } = require('openai');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
// AWS_ACCESS_KEY_ID=AKIA2XAEOTXPJZVDOTQQ
// AWS_SECRET_ACCESS_KEY=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
const bedrock = new BedrockRuntimeClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: 'AKIA2XAEOTXPJZVDOTQQ',
    secretAccessKey: '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',
  },
});

async function generateSchemaForHtml(read_file_path, write_file_path) {
  //read the file
  const html = await readFile(read_file_path, 'utf8');

  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  // });

  // openai.beta.threads

  const input = {
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      system: `
      You are writing directly to disk so please be careful. Do not output anything other than code changes.
    
      If you would like to replace a line of code, please provide the exact search term and the replacement code.
      This only works for single line not multi-line code changes. You can stack multiple search and replace pairs but only one per filename block.
      Example: 

      ===filename:src/components/ChatInput.js===
      ===search:const ExampleCodeBlock = () => {===
      ===replace:const NewReplacedCodeBlock = ({}) => {===
      ===end===

      If you are writing a brand new file:

      ===filename:src/pages/Example.tsx===
      import React from 'react';
      ... more code ...
      export default ...;
      ===end===


      Finally --- You are only to write code and nothing else.
      All code goes in the pages directory.
      
      `,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Create an operations dashboard with demo visuals.',
            },
            {
              type: 'text',
              text: `
              For each section in the dashboard in sales make sure they have a visual representation of the data.
              Come up with Dummy Data for the dashboard.
              `,
            },
            {
              type: 'text',
              text: html,
            },
          ],
        },
        {
          role: 'assistant',
          content: 'Making the changes you requested now...\n===filename:',
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

    await writeFile(
      write_file_path,
      JSON.parse(schema)
        .content[0].text?.replace('```json', '')
        .replace('```', ''),
      {
        encoding: 'utf8',
      },
    );
  } catch (error) {
    console.error('Error generating schema:', error);

    // read a file
  }
}

// Usage
const read_file_path = './fullrepo.txt';
const write_file_path = './refactored.txt';

generateSchemaForHtml(read_file_path, write_file_path);
