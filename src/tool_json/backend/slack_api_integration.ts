import {
  channelMembers,
  channelMessages,
  channelsSchema,
  threadsSchema,
  usersSchema,
} from '../compiled_taps/slack';

const slack_api_integration = {
  type: 'function',
  function: {
    name: 'slack_api_integration',
    description: 'This function is used to integrate with the Slack API.',
    parameters: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          description: 'The operation to perform',
          enum: ['update', 'create', 'delete', 'query'],
        },
        entity: {
          type: 'string',
          description: 'The entity to perform the operation on.',
          enum: [
            'channel_members',
            'channel_messages',
            'channels',
            'threads',
            'users',
          ],
        },
        body: {
          type: 'object',
          description: 'That data to complete the operation with.',
          oneOf: [
            {
              entity: ['channel_members'],
              operation: ['update', 'create', 'delete', 'query'],
              ...channelMembers,
            },
            {
              entity: ['channel_messages'],
              operation: ['update', 'create', 'delete', 'query'],
              ...channelMessages,
            },
            {
              entity: ['channels'],
              operation: ['update', 'create', 'delete', 'query'],
              ...channelsSchema,
            },
            {
              entity: ['threads'],
              operation: ['update', 'create', 'delete', 'query'],
              ...threadsSchema,
            },
            {
              entity: ['users'],
              operation: ['update', 'create', 'delete', 'query'],
              ...usersSchema,
            },
          ],
        },
      },
    },
  },
};

export default slack_api_integration;
//
