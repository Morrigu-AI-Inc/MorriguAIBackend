import { BaseTool, ToolEndpoint } from 'src/tools/types';

export class Notepad extends BaseTool {
  public name = 'tools/notepad';
  public description = `
  NOTEPAD TOOL
  
  This tool is a simple notepad that allows ai to store its thoughts and ideas.
  Using the Chain of Thought method - the ai can store its thoughts and ideas in a structured way.
  Using the Buffer of Thoughts the assistant can break down complex ideas into smaller parts.
  These are then store in the conversation history. Allowing the ai to refer back to them at a later date.

  Consider this tool the scratch pad for the ai.
  `;
  public input_schema = {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        description: 'API endpoint for the request',
        enum: ['/tools/notepad'],
      },
      method: {
        type: 'string',
        enum: ['POST'],
        description: 'HTTP method used for the request',
        default: 'POST',
      },
      contentType: {
        type: 'string',
        enum: ['application/json'],
        description: 'Content type of the request body',
        default: 'application/json',
      },
      headers: {
        type: 'object',
        description: 'Headers to send to the tool',
        default: {},
      },
      queryParameters: {
        oneOf: [],
      },
      body: {
        type: 'object',
        description: 'Payload to send to the tool',
        default: {},
        oneOf: [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Title of the note',
                  },
                  content: {
                    type: 'string',
                    description: 'Content of the note',
                  },
                },
                required: ['title', 'content'],
              },
            },
          },
        ],
      },
    },
    required: ['endpoint', 'method', 'contentType', 'headers', 'body'],
    additionalProperties: false,
  };
}
