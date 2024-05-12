import assistants from 'src/assistant/assistants_json';

const list = Object.values(assistants).map((assistant) => assistant.id);

export const change_assistant_tool = {
  type: 'function',
  function: {
    name: 'change_assistant_tool',
    description: `
      Change the assistant used in the current thread.

      This tool is used to change the assistant used in the current thread. The assistant is used to generate responses to messages in the thread. The assistant must be one of the assistants that is available in the system.
    `,
    parameters: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        assistant_id: {
          type: 'string',
          enum: list,
          description: `
            The assistant to use in the current thread. The assistant must be one of the assistants that is available in the system.

            The available assistants are:

            ${Object.entries(assistants)
              .map(([, value]) => `${value.id}: ${value.assistant_summary}`)
              .join('\n')}
              
          `,
        },
      },
    },
  },
};
