import display_chart from './frontend/display_chart';
import user_confirm from './frontend/user_confirm';
import { quickbooks_query } from './quickbooks_query';

export const frontend_tools = [user_confirm, display_chart];

const tools = [quickbooks_query, ...frontend_tools];

export default tools;
