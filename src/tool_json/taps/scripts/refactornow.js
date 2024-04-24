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

      You must provide both the search term and the replacement code.

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
      
      Do not ask or tell the user to create anything in the codebase. You are to make all edits directly. This script will get run again if you are not finished.
      
      At the end of the response you should inform the user whether you are finish or not and if not write ====incomplete==== at the end of the response.

      Writing ====incomplete==== will trigger this script to run again the changes will get saved and you will start anew.

      Design - You MUST write code that is clean and follows the design patterns of the codebase.
      
      `,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'We are creating an AI saas expense management platform. This platform is for Corporate Finance teams to manage their expenses and reports. We need to consider the following:',
            },
            {
              type: 'text',
              text: html,
            },

            {
              type: 'text',
              text: `
              Let's start with the following pages/components or edits to existing pages/components focus only on out finance platform. Here are the pages I need to create or edit:
              - Reports
                - Expense Page
                  - This page should show a list of expenses and allow the user to filter by date, category, and amount.
                  - The user should be able to click on an expense to view more details.
                  - The user should be able to edit an expense.
                  - The user should be able to delete an expense.
                  - The user should be able to add a new expense.
                  - The user should be able to export the expenses to a CSV file.
                  - The user should be able to print the expenses.
                  - The user should be able to search for an expense.
                  - The user should be able to sort the expenses.
                  - The user should be able to create a new expense.
                  - Anything else that makes this platform top of the line.
              - Settings
              `,
            },
            {
              type: 'text',
              text: `
              Make an amazing expense management platform for Corporate Finance teams. Remember we have the utilization of conversational AI,
              `,
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
const write_file_path =
  './refactored/refactored-' + new Date().getTime() + '.changes';

generateSchemaForHtml(read_file_path, write_file_path);
