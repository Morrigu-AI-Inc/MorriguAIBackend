import create_invoice from './backend/create_invoice';
import display_chart from './frontend/display_chart';
import user_confirm from './frontend/user_confirm';
import { quickbooks_query } from './quickbooks_query';
import quickbooks_update from './backend/quickbooks_update';

export const frontend_tools = [display_chart];
export const backend_tools = [quickbooks_query, quickbooks_update];
const tools = [...frontend_tools, ...backend_tools, display_chart];

export default tools;
