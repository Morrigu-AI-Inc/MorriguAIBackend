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
  region: 'us-east-1',
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
      You are you goin to perform a series of changes to the codebase.
      You are writing directly to disk so please be careful.
      Follow the pattern in the codebase and make the edits accordingly. 
      The post-processed code will be saved to the file '${read_file_path}'.

      User Request:
      - I need to finish off the OnboardingFlow component.
      - Add the necessary changes to the OnboardingFlow component.



      Assistant Response:
       Only output CODE to the file '${write_file_path}'.
       Only include changes or new pages and components in the output.
       The output will be parsed into the codebase.
      `,
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
