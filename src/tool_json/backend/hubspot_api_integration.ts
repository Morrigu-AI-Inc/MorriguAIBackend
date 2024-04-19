import * as crm_object_companies from '../taps/tap-hubspot/crm-objects-companies.json';
import * as crm_object_contacts from '../taps/tap-hubspot/crm-objects-contacts.json';
import * as crm_object_company from '../taps/tap-hubspot/crm-objects-companies.json';
import * as crm_object_deals from '../taps/tap-hubspot/crm-objects-deals.json';
import * as crm_object_feedback_submissions from '../taps/tap-hubspot/crm-objects-feedback-submissions.json';
import * as crm_object_tickets from '../taps/tap-hubspot/crm-objects-tickets.json';
import * as crm_object_schemas from '../taps/tap-hubspot/crm-objects-schemas.json';
import * as crm_object_goals_targets from '../taps/tap-hubspot/crm-objects-goals.json';

const all = [
  crm_object_companies,
  crm_object_contacts.properties.getContacts,
  crm_object_contacts.properties.getContact,
  crm_object_deals,
  crm_object_company,
  crm_object_feedback_submissions,
  crm_object_tickets.properties.listTickets,
  crm_object_tickets.properties.getTicket,
  crm_object_tickets.properties.updateTicket,
  crm_object_tickets.properties.readBatchTickets,
  crm_object_tickets.properties.updateBatchTickets,
  crm_object_tickets.properties.createTicket,
  crm_object_schemas,
  crm_object_goals_targets,
];

const hubspot_api_integration = {
  type: 'function',
  function: {
    name: 'hubspot_api_integration',
    description: `
    This function allows you to interact with the Hubspot API.

    Special Notes: 
    
    You must always provide the endpoint to call on the Hubspot API.
    You must always provide the data to complete the operation with.
    
    `,
    parameters: {
      type: 'object',
      properties: {
        endpoint: {
          type: 'string',
          description: 'The endpoint to call on the HubSpot API.',
          enum: [
            '/crm/v3/objects/companies',
            '/crm/v3/objects/contacts',
            '/crm/v3/objects/deals',
            '/crm/v3/objects/contacts/{contactId}',
            '/crm/v3/objects/companies/{companyId}',
            '/crm/v3/objects/deals/{dealId}',
            '/crm/v3/objects/feedback_submissions',
            '/crm/v3/objects/feedback_submissions/{feedbackSubmissionId}',
            '/crm/v3/objects/tickets',
            '/crm/v3/objects/tickets/{ticketId}',
            '/crm/v3/schemas/{objectType}',
            '/crm/v3/schemas/{fullyQualifiedName}',
            '/crm/v3/objects/goal_targets',
            '/crm/v3/objects/goal_targets/{goalTargetId}',
            '/crm/v3/objects/contacts/properties',
            '/crm/v3/objects/contacts/properties/named/{name}',
          ],
        },
        body: {
          type: 'object',
          description: 'That data to complete the operation with.',
          oneOf: all,
        },
      },
      required: ['endpoint', 'body'],
    },
  },
};

export default hubspot_api_integration;
