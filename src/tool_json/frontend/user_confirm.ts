const user_confirm = {
  type: 'function',
  function: {
    name: 'user_confirm',
    description:
      'This tool is only use for confirming the user before proceeding to the next step.',
    parameters: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description:
            'Specifies the message to be displayed to the user to confirm.',
        },
      },
      required: ['message'],
    },
  },
};

export default user_confirm;
