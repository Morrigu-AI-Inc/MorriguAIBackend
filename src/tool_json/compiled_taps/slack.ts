import * as deref from 'json-schema-deref-sync';

import * as channel_members from '../taps/tap-slack/channel_members.json';

const deref_channel_members = deref(channel_members, {
  baseFolder: 'src/tool_json/taps/tap-slack',
});

export const chanelMembers = {
  type: 'object',
  required: [],
  ...deref_channel_members,
};
