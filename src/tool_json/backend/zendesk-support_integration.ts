import {
  accountAttrs,
  articleComments,
  articles,
  attributeDefinitions,
  auditLogs,
  brands,
  customRoles,
  deletedTickets,
  groupMemberships,
  groups,
  macros,
  organizationFields,
  organizationMemberships,
  organizationsSchema,
  postComments,
  postsSchema,
  satisfactionRatings,
  schedulesSchema,
  slaPolicies,
  tagsSchema,
  ticketAudits,
  ticketFields,
  ticketForms,
  ticketMetricEvents,
  ticketMetrics,
  ticketSkips,
  ticketsSchema,
  topics,
  userFieldsSchema,
  usersSchema,
  votesSchema,
} from '../compiled_taps/zendesk_support';

const zendesk_support_integration = {
  type: 'function',
  function: {
    name: 'zendesk_support_integration',
    description: 'This function will integrate with the GitHub API.',
    parameters: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          description: 'The operation to perform',
          enum: ['get', 'post', 'put', 'delete'],
        },
        entity: {
          type: 'string',
          description: 'The entity to perform the operation on.',
          enum: [
            'account_attributes',
            'article_comments',
            'articles',
            'attribute_definitions',
            'audit_logs',
            'brands',
            'custom_roles',
            'deleted_tickets',
            'group_memberships',
            'groups',
            'macros',
            'organization_fields',
            'organization_memberships',
            'organizations',
            'post_comments',
            'posts',
            'satisfaction_ratings',
            'schedules',
            'sla_policies',
            'tags',
            'ticket_audits',
            'ticket_fields',
            'ticket_forms',
            'ticket_metrics',
            'ticket_metric_events',
            'ticket_skips',
            'tickets',
            'topics',
            'user_fields',
            'users',
            'votes',
          ],
        },
        body: {
          type: 'object',
          description: 'That data to complete the operation with.',
          oneOf: [
            {
              entity: 'account_attributes',
              ...accountAttrs,
            },
            {
              entity: 'article_comments',
              ...articleComments,
            },
            {
              entity: 'articles',
              ...articles,
            },
            {
              entity: 'attribute_definitions',
              ...attributeDefinitions,
            },
            {
              entity: 'audit_logs',
              ...auditLogs,
            },
            {
              entity: 'brands',
              ...brands,
            },
            {
              entity: 'custom_roles',
              ...customRoles,
            },
            {
              entity: 'deleted_tickets',
              ...deletedTickets,
            },
            {
              entity: 'group_memberships',
              ...groupMemberships,
            },
            {
              entity: 'groups',
              ...groups,
            },
            {
              entity: 'macros',
              ...macros,
            },
            {
              entity: 'organization_fields',
              ...organizationFields,
            },
            {
              entity: 'organization_memberships',
              ...organizationMemberships,
            },
            {
              entity: 'organizations',
              ...organizationsSchema,
            },
            {
              entity: 'post_comments',
              ...postComments,
            },
            {
              entity: 'posts',
              ...postsSchema,
            },
            {
              entity: 'satisfaction_ratings',
              ...satisfactionRatings,
            },
            {
              entity: 'schedules',
              ...schedulesSchema,
            },
            {
              entity: 'sla_policies',
              ...slaPolicies,
            },
            {
              entity: 'tags',
              ...tagsSchema,
            },
            {
              entity: 'ticket_audits',
              ...ticketAudits,
            },
            {
              entity: 'ticket_fields',
              ...ticketFields,
            },
            {
              entity: 'ticket_forms',
              ...ticketForms,
            },
            {
              entity: 'ticket_metrics',
              ...ticketMetrics,
            },
            {
              entity: 'ticket_metric_events',
              ...ticketMetricEvents,
            },
            {
              entity: 'ticket_skips',
              ...ticketSkips,
            },
            {
              entity: 'tickets',
              ...ticketsSchema,
            },
            {
              entity: 'topics',
              ...topics,
            },
            {
              entity: 'user_fields',
              ...userFieldsSchema,
            },
            {
              entity: 'users',
              ...usersSchema,
            },
            {
              entity: 'votes',
              ...votesSchema,
            },
          ],
        },
      },
    },
  },
};

export default zendesk_support_integration;
