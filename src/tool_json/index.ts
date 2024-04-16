import create_invoice from './backend/create_invoice';
import display_chart from './frontend/display_chart';
import user_confirm from './frontend/user_confirm';
import { quickbooks_query } from './quickbooks_query';

export const frontend_tools = [user_confirm, display_chart];
export const backend_tools = [quickbooks_query, create_invoice];
const tools = [...backend_tools, ...frontend_tools];

export default tools;
