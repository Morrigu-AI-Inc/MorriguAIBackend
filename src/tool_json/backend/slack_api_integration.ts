import * as admin_users_list from '../taps/tap-slack/admin.users.list.json';
import * as users_list from '../taps/tap-slack/users.list.json';
import * as conversations_join from '../taps/tap-slack/conversations.join.json';
import * as conversations_list from '../taps/tap-slack/conversations.list.json';
import * as conversations_members from '../taps/tap-slack/conversations.members.json';
import * as conversations_history from '../taps/tap-slack/conversations.history.json';
import * as conversations_create from '../taps/tap-slack/conversations.create.json';
import * as usersgroup_create from '../taps/tap-slack/usergroups.create.json';
import * as users_conversations from '../taps/tap-slack/users.conversations.json';

const all = [
  admin_users_list,
  users_list,
  conversations_join,
  conversations_list,
  conversations_members,
  conversations_history,
  conversations_create,
  usersgroup_create,
  users_conversations,
];

const slack_api_integration = {
  type: 'function',
  function: {
    name: 'slack_api_integration',
    description: `
    This function allows you to integration with any function of the Slack API. You can do anything with this integrations, from creating a conversation to fetching a user's list.

    Special Notes: 
    POST'ing to conversation.history fetches a conversation's history of messages does not create a new message.
    
    `,
    parameters: {
      type: 'object',
      properties: {
        endpoint: {
          type: 'string',
          description: 'The endpoint to call on the Slack API.',
          enum: [
            'admin.analytics.getFile',
            'admin.apps.activities.list',
            'admin.apps.approve',
            'admin.apps.clearResolution',
            'admin.apps.restrict',
            'admin.apps.approved.list',
            'admin.apps.requests.list',
            'admin.apps.restrict.list',
            'admin.apps.approve.list',
            'admin.apps.uninstall',

            'admin.barriers.create',
            'admin.barriers.delete',
            'admin.barriers.list',
            'admin.barriers.update',
            'admin.emoji.add',
            'admin.emoji.addAlias',
            'admin.emoji.list',
            'admin.emoji.remove',
            'admin.emoji.rename',
            'admin.functions.list',
            'admin.functions.permissions.lookup',
            'admin.functions.permissions.set',

            'admin.inviteRequests.approve',
            'admin.inviteRequests.deny',
            'admin.inviteRequests.list',
            'admin.roles.addAssignments',

            'admin.users.list', // pass
            'calls.add', // pass
            'calls.end', // pass
            'calls.info', // pass
            'calls.update', // pass
            'calls.participants.remove', // pass
            'calls.participants.add', // pass
            'users.list', // pass
            'chat.delete', // pass
            'chat.deleteScheduledMessage', // pass
            'chat.getPermalink', // pass
            'chat.meMessage', // pass
            'chat.postEphemeral', // pass
            'chat.unfurl', // pass
            'chat.update', // pass
            'chat.scheduledMessages.list', // pass

            'conversations.join', // pass
            'conversations.leave', // pass
            'conversations.list', // pass
            'conversations.members', // pass
            'conversations.history', //  pass
            'conversations.replies', // pass
            'conversations.open', // pass
            'conversations.close', //  pass
            'conversations.create', // pass
            'conversations.rename', // pass
            'conversations.archive', // pass
            'conversations.unarchive', // perms
            'conversations.invite', //
            'conversations.kick', // perms
            'conversations.setPurpose', // pass
            'conversations.setTopic', // pass
            'conversations.mark', // pass
            'conversations.reactions', // pass
            'conversations.unreadCount', // pass
            'conversations.info', // pass
            'usergroups.create', // pass
            'usergroups.disable', // pass
            'usergroups.enable', // pass
            'usergroups.list', // pass
            'usergroups.update', // pass
            'usergroups.users.list', // pass
            'usergroups.users.update', // pass
            'users.conversations', // pass
            'users.deletePhoto', // pass
            'users.getPresence', // pass
            'users.identity', // pass
            'users.info', // pass
            'users.list', // pass
            'users.lookupByEmail', // pass
            'users.setActive', // pass
            'users.setPhoto', // pass
            'users.setPresence', // pass
            'users.profile.get', // pass
            'users.profile.set', // pass
            'dialog.open', // pass
            'dnd.endDnd', // pass
            'dnd.endSnooze', // pass
            'dnd.info', // pass
            'dnd.setSnooze', // pass
            'dnd.teamInfo', // pass
            'files.comments.add', // pass
            'files.comments.delete', // pass
            'reactions.add', // pass
            'reactions.get', // pass
            'reactions.list', // pass
            'reactions.remove', // pass
            'reminders.add', // pass
            'reminders.complete', // pass
            'reminders.delete', // pass
            'reminders.info', // pass
            'reminders.list', // pass
            'search.all', // pass
            'search.files', // pass
            'search.messages', // pass
            'stars.add', // pass
            'stars.list', // pass
            'stars.remove', // pass
            'team.accessLogs', // pass
            'team.billableInfo', // pass
            'team.info', // pass
            'team.integrationLogs', // pass
            'team.profile.get', // pass
            'team.preferences.list', // pass
            'users.conversations', // pass
            'users.deletePhoto', // pass
            'users.getPresence', // pass
            'users.identity', // pass
            'users.info', // pass
            'users.list', // pass
            'users.lookupByEmail', // pass
            'users.setActive', // pass
            'users.setPhoto', // pass
            'users.setPresence', // pass
            'users.profile.get', // pass
            'users.profile.set', // pass
            'views.open', // pass
            'views.publish', // pass
            'views.push', // pass
            'views.update', // pass
            'workflows.stepCompleted', // pass
            'workflows.stepFailed', // pass
            'workflows.updateStep', // pass
          ],
        },
        body: {
          type: 'object',
          description: 'That data to complete the operation with.',
          oneOf: all,
          additionalProperties: true,
        },

        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        },
        contentType: {
          type: 'string',
          enum: ['application/json'],
        },
        queryParameters: {
          type: 'object',
          properties: {},
          required: [],
          additionalProperties: true,
        },
      },
      required: ['endpoint', 'body'],
    },
  },
};

export default slack_api_integration;
//
