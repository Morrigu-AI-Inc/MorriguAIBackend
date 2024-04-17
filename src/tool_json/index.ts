import display_chart from './frontend/display_chart';
import { quickbooks_query } from './quickbooks_query';
import quickbooks_update from './backend/quickbooks_update';
import github_api_integration from './backend/github_api_integration';
import zendesk_support_integration from './backend/zendesK-support_integration';

export const frontend_tools = [display_chart];
export const backend_tools = [
  quickbooks_query,
  quickbooks_update,
  // github_api_integration,
  // zendesk_support_integration,
];
const tools = [...frontend_tools, ...backend_tools];

export default tools;
