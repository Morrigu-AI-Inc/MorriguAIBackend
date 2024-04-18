import * as deref from 'json-schema-deref-sync';

import * as channel_members from 'src/tool_json/taps/tap-slack/channel_members.json';
import * as channel_messages from 'src/tool_json/taps/tap-slack/channel_messages.json';
import * as channels from 'src/tool_json/taps/tap-slack/channels.json';
import * as threads from 'src/tool_json/taps/tap-slack/threads.json';
import * as users from 'src/tool_json/taps/tap-slack/users.json';

const deref_channel_members = deref(channel_members, {
  baseFolder: 'src/tool_json/taps/tap-slack',
});

export const channelMembers = {
  type: 'object',
  required: [],
  ...deref_channel_members,
};

const deref_channel_messages = deref(channel_messages, {
  baseFolder: 'src/tool_json/taps/tap-slack',
});

export const channelMessages = {
  type: 'object',
  required: [],
  ...deref_channel_messages,
};

const deref_channels = deref(channels, {
  baseFolder: 'src/tool_json/taps/tap-slack',
});

export const channelsSchema = {
  type: 'object',
  required: [],
  ...deref_channels,
};

const deref_threads = deref(threads, {
  baseFolder: 'src/tool_json/taps/tap-slack',
});

export const threadsSchema = {
  type: 'object',
  required: [],
  ...deref_threads,
};

const deref_users = deref(users, {
  baseFolder: 'src/tool_json/taps/tap-slack',
});

export const usersSchema = {
  type: 'object',
  required: [],
  ...deref_users,
};