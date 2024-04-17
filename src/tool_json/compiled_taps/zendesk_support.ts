import * as deref from 'json-schema-deref-sync';

import * as account_attributes from 'src/tool_json/taps/tap-zendesk-support/account_attributes.json';
import * as article_comments from 'src/tool_json/taps/tap-zendesk-support/article_comments.json';
import * as articlesSchema from 'src/tool_json/taps/tap-zendesk-support/articles.json';
import * as attribute_definitions from 'src/tool_json/taps/tap-zendesk-support/attribute_definitions.json';
import * as audit_logs from 'src/tool_json/taps/tap-zendesk-support/audit_logs.json';
import * as brandsSchema from 'src/tool_json/taps/tap-zendesk-support/brands.json';
import * as custom_roles from 'src/tool_json/taps/tap-zendesk-support/custom_roles.json';
import * as deleted_tickets from 'src/tool_json/taps/tap-zendesk-support/deleted_tickets.json';
import * as group_memberships from 'src/tool_json/taps/tap-zendesk-support/group_memberships.json';
import * as groupsSchema from 'src/tool_json/taps/tap-zendesk-support/groups.json';
import * as macrosSchema from 'src/tool_json/taps/tap-zendesk-support/macros.json';
import * as organization_fields from 'src/tool_json/taps/tap-zendesk-support/organization_fields.json';
import * as organization_memberships from 'src/tool_json/taps/tap-zendesk-support/organization_memberships.json';
import * as organizations from 'src/tool_json/taps/tap-zendesk-support/organizations.json';
import * as post_comments from 'src/tool_json/taps/tap-zendesk-support/post_comments.json';
import * as posts from 'src/tool_json/taps/tap-zendesk-support/posts.json';
import * as satisfaction_ratings from 'src/tool_json/taps/tap-zendesk-support/satisfaction_ratings.json';
import * as schedules from 'src/tool_json/taps/tap-zendesk-support/schedules.json';
import * as sla_policies from 'src/tool_json/taps/tap-zendesk-support/sla_policies.json';
import * as tags from 'src/tool_json/taps/tap-zendesk-support/tags.json';
import * as ticket_audits from 'src/tool_json/taps/tap-zendesk-support/ticket_audits.json';
import * as ticket_fields from 'src/tool_json/taps/tap-zendesk-support/ticket_fields.json';
import * as ticket_forms from 'src/tool_json/taps/tap-zendesk-support/ticket_forms.json';
import * as ticket_metrics from 'src/tool_json/taps/tap-zendesk-support/ticket_metrics.json';
import * as ticket_metric_events from 'src/tool_json/taps/tap-zendesk-support/ticket_metric_events.json';
import * as ticket_skips from 'src/tool_json/taps/tap-zendesk-support/ticket_skips.json';
import * as tickets from 'src/tool_json/taps/tap-zendesk-support/tickets.json';
import * as topicsSchema from 'src/tool_json/taps/tap-zendesk-support/topics.json';
import * as user_fields from 'src/tool_json/taps/tap-zendesk-support/user_fields.json';
import * as users from 'src/tool_json/taps/tap-zendesk-support/users.json';
import * as votes from 'src/tool_json/taps/tap-zendesk-support/votes.json';

const deref_account_attrs = deref(account_attributes, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const accountAttrs = {
  type: 'object',
  required: [],
  ...deref_account_attrs,
};

const deref_article_comments = deref(article_comments, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const articleComments = {
  type: 'object',
  required: [],
  ...deref_article_comments,
};

const deref_articles = deref(articlesSchema, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const articles = {
  type: 'object',
  required: [],
  ...deref_articles,
};

const deref_attribute_definitions = deref(attribute_definitions, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const attributeDefinitions = {
  type: 'object',
  required: [],
  ...deref_attribute_definitions,
};

const deref_audit_logs = deref(audit_logs, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const auditLogs = {
  type: 'object',
  required: [],
  ...deref_audit_logs,
};

const deref_brands = deref(brandsSchema, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const brands = {
  type: 'object',
  required: [],
  ...deref_brands,
};

const deref_custom_roles = deref(custom_roles, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const customRoles = {
  type: 'object',
  required: [],
  ...deref_custom_roles,
};

const deref_deleted_tickets = deref(deleted_tickets, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const deletedTickets = {
  type: 'object',
  required: [],
  ...deref_deleted_tickets,
};

const deref_group_memberships = deref(group_memberships, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const groupMemberships = {
  type: 'object',
  required: [],
  ...deref_group_memberships,
};

const deref_groups = deref(groupsSchema, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const groups = {
  type: 'object',
  required: [],
  ...deref_groups,
};

const deref_macros = deref(macrosSchema, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const macros = {
  type: 'object',
  required: [],
  ...deref_macros,
};

const deref_organization_fields = deref(organization_fields, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const organizationFields = {
  type: 'object',
  required: [],
  ...deref_organization_fields,
};

const deref_organization_memberships = deref(organization_memberships, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const organizationMemberships = {
  type: 'object',
  required: [],
  ...deref_organization_memberships,
};

const deref_organizations = deref(organizations, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const organizationsSchema = {
  type: 'object',
  required: [],
  ...deref_organizations,
};

const deref_post_comments = deref(post_comments, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const postComments = {
  type: 'object',
  required: [],
  ...deref_post_comments,
};

const deref_posts = deref(posts, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const postsSchema = {
  type: 'object',
  required: [],
  ...deref_posts,
};

const deref_satisfaction_ratings = deref(satisfaction_ratings, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const satisfactionRatings = {
  type: 'object',
  required: [],
  ...deref_satisfaction_ratings,
};

const deref_schedules = deref(schedules, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const schedulesSchema = {
  type: 'object',
  required: [],
  ...deref_schedules,
};

const deref_sla_policies = deref(sla_policies, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const slaPolicies = {
  type: 'object',
  required: [],
  ...deref_sla_policies,
};

const deref_tags = deref(tags, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const tagsSchema = {
  type: 'object',
  required: [],
  ...deref_tags,
};

const deref_ticket_audits = deref(ticket_audits, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const ticketAudits = {
  type: 'object',
  required: [],
  ...deref_ticket_audits,
};

const deref_ticket_fields = deref(ticket_fields, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const ticketFields = {
  type: 'object',
  required: [],
  ...deref_ticket_fields,
};

const deref_ticket_forms = deref(ticket_forms, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const ticketForms = {
  type: 'object',
  required: [],
  ...deref_ticket_forms,
};

const deref_ticket_metrics = deref(ticket_metrics, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const ticketMetrics = {
  type: 'object',
  required: [],
  ...deref_ticket_metrics,
};

const deref_ticket_metric_events = deref(ticket_metric_events, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const ticketMetricEvents = {
  type: 'object',
  required: [],
  ...deref_ticket_metric_events,
};

const deref_ticket_skips = deref(ticket_skips, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const ticketSkips = {
  type: 'object',
  required: [],
  ...deref_ticket_skips,
};

const deref_tickets = deref(tickets, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const ticketsSchema = {
  type: 'object',
  required: [],
  ...deref_tickets,
};

const deref_topics = deref(topicsSchema, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const topics = {
  type: 'object',
  required: [],
  ...deref_topics,
};

const deref_user_fields = deref(user_fields, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const userFieldsSchema = {
  type: 'object',
  required: [],
  ...deref_user_fields,
};

const deref_users = deref(users, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const usersSchema = {
  type: 'object',
  required: [],
  ...deref_users,
};

const deref_votes = deref(votes, {
  baseFolder: 'src/tool_json/taps/tap-zendesk-support/shared',
});

export const votesSchema = {
  type: 'object',
  required: [],
  ...deref_votes,
};
