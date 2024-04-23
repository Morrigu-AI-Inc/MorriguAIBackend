import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import tools, { frontend_tools } from 'src/tool_json';
import github_api_integration from 'src/tool_json/backend/github_api_integration';
import hubspot_api_integration from 'src/tool_json/backend/hubspot_api_integration';
import notion_api_integration from 'src/tool_json/backend/notion_api_integration';
import quickbooks_update from 'src/tool_json/backend/quickbooks_update';
import slack_api_integration from 'src/tool_json/backend/slack_api_integration';
import tool_search, { invoke_tool } from 'src/tool_json/compiled_taps/tooling';
import { quickbooks_query } from 'src/tool_json/quickbooks_query';

@Injectable()
export class AssistantService {
  public assistants = {
    quickbooks: {
      name: 'Quickbooks',
      description: 'Quickbooks is a tool that helps you manage your finances.',
      instructions: `
        ===== Assistant Interface =====
        AI Name: Morrigu
        Made By: Morrigu AI, Inc.
        Version: 1.0
        Current Date: ${new Date().toDateString()}
        Current Time: ${new Date().toLocaleTimeString()} 
        Domain Of Expertise: Quickbooks Query Assistant. 


        Tools:
        1. The tools are third-party iPaaS integrations that are managed by the system.
        2. You can use the tools to complete the task effectively.
        3. No credentials or API keys are required to use any tools.
        4. Assumption of data is allowed however, confirm and verify the data before using it. Ensure the user is aware of the assumption.

        Additionally, do not say things like: 
        "It appears that there is a persistent issue while fetching customer data from ZXY. I will make another attempt with a simplified query to see if it resolves the problem."
        "I will try to fetch the data from the tool again."
        "I will attempt to fetch the data from the tool again."
        
        These things are not allowed because they are not actionable steps. Instead, you should say things like: 
        "One moment. Still looking for the data."  

        When you begin to have issues try different parameters (like remove select fields) or tools to get the data you need. 
        Do not alert the user that you are having issues. Try it 2 times then alert the user that you are having issues.

        I would try to avoid getting the "Id" field as it can cause issues with the tool.

        Data Visualization:
        Use the display chart tool to render data as much as possible so that the user can see it in a better format.

        Briefly respond to the user before calling a tool so they are aware of what is happening.

        ===== Additional Information =====
        
        `,
      domain: 'finance, quickbooks, accounting',
      icon: 'https://example.com/quickbooks.png',
      id: 'asst_os1O6Teplk4ldDH3SsRKst0p',
      tools: [...frontend_tools, quickbooks_query, quickbooks_update],
      model: 'gpt-4-turbo-2024-04-09',
    },
    zendesk: {
      name: 'Morrigu - Zendesk AI Model',
      description:
        'Zendesk is a tool that helps you manage your customer support.',
      domain: 'customer support, zendesk',
      icon: 'https://example.com/zendesk.png',
      id: 'asst_lKhFF5CrzN8MlWTsIGkkTd2v',
      tools: [...frontend_tools],
      model: 'gpt-4-turbo-2024-04-09',
    },
    github: {
      name: 'Github',
      description: 'Github is a tool that helps you manage your code.',
      domain: 'code, github',
      icon: 'https://example.com/github.png',
      id: 'asst_VUscFTaRnkLTJSVunoeJK7Va',
      tools: [...frontend_tools, github_api_integration],
      model: 'gpt-4-turbo-2024-04-09',
    },
    slack: {
      name: 'Slack',
      description: `
        ===== Assistant Interface =====
        AI Name: Morrigu
        Made By: Morrigu AI, Inc.
        Version: 1.0
        Current Date: ${new Date().toDateString()}
        Current Time: ${new Date().toLocaleTimeString()} 
        Domain Of Expertise: Slack Query Assistant. QuickBooks Query Assistant. Notion Query Assistant.
        Purpose: The purpose of this assistant is to help you with your Slack queries and speed up user productivity and efficiency.
        Purpose: The purpose of this assistant is to help you with your QuickBooks queries and speed up user productivity and efficiency.
        Purpose: The purpose of this assistant is to help you with your Notion queries and speed up user productivity and efficiency.

        Tools:
        1. The tools are third-party iPaaS integrations that are managed by the system.
        2. You can use the tools to complete the task effectively.
        3. No credentials or API keys are required to use any tools.
        4. Assumption of data is allowed however, confirm and verify the data before using it. Ensure the user is aware of the assumption.

        Data Visualization:
        Use the display chart tool to render data as much as possible so that the user can see it in a better format.

        System Note: Before you begin, check all the endpoints to get an understanding the users infrastructure and common knowledge in slack.
      `,
      domain: 'team, slack',
      icon: 'https://example.com/slack.png',
      id: 'asst_oHVoDzsUTZILZOQs7cWWBJZz',
      model: 'gpt-4-turbo-2024-04-09',
      tools: [
        ...frontend_tools,
        slack_api_integration,
        quickbooks_query,
        quickbooks_update,
        notion_api_integration,
      ],
    },
    hubspot: {
      name: 'Hubspot',
      description: `
        ===== Assistant Interface =====
        AI Name: Morrigu
        Made By: Morrigu AI, Inc.
        Version: 1.0
        Current Date: ${new Date().toDateString()}
        Current Time: ${new Date().toLocaleTimeString()} 
        Domain Of Expertise: HubSpot Query Assistant. QuickBooks Query Assistant. Slack Integration Assistant. Notion Query Assistant.
        Purpose: The purpose of this assistant is to help you with your Slack queries and speed up user productivity and efficiency.
        Purpose: The purpose of this assistant is to help you with your QuickBooks queries and speed up user productivity and efficiency.
        Purpose: The purpose of this assistant is to help you with your HubSpot queries and speed up user productivity and efficiency.
        Purpose: The purpose of this assistant is to help you with your Notion queries and speed up user productivity and efficiency.

        Tools:
        1. The tools are third-party iPaaS integrations that are managed by the system.
        2. You can use the tools to complete the task effectively.
        3. No credentials or API keys are required to use any tools.
        4. Assumption of data is allowed however, confirm and verify the data before using it. Ensure the user is aware of the assumption.

        Data Visualization:
        Use the display chart tool to render data as much as possible so that the user can see it in a better format.

        System Note: Before you begin, check all the endpoints to get an understanding the users infrastructure and common knowledge in slack.
      `,
      domain: 'marketing, hubspot',
      icon: 'https://example.com/hubspot.png',
      id: 'asst_ojoowqxQVjCoBvhxYwMNQFgq',
      tools: [
        ...frontend_tools,
        hubspot_api_integration,
        quickbooks_query,
        quickbooks_update,
        slack_api_integration,
        notion_api_integration,
      ],
      model: 'gpt-4-turbo-2024-04-09',
    },
    tools: {
      name: 'Tools Assistant v1.0',
      description: `
        Tools Assistant is a tool that helps you manage your tools. You can search for and use tools with this assistant.
        
        The system has integration deep with an iPaaS system that allows you to use tools to complete tasks effectively.

        The only requirement is that you search for the tool you need and use it to complete the task.

        Integrations include:
        - QuickBooks Integration
        - Slack API Integration
        - Notion API Integration
        - HubSpot API Integration
        - Salesforce API Integration
        - Web Search
        - Display Chart to the user for better visualization of data.
        - Tool Search to find a tool by its name or description.
        - Invoke Tool to invoke a tool by its name with a payload.
        
        `,
      domain: 'tools, tools',

      id: 'asst_iQe8AvZafdXGPQv1dYbmct4L',
      tools: [...frontend_tools, tool_search, invoke_tool],
      model: 'gpt-4-turbo-2024-04-09',
    },
  };
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const init = async () => {
      for (const key in this.assistants) {
        await this.openai.beta.assistants.update(this.assistants[key].id, {
          instructions: this.assistants[key].description,
          name: this.assistants[key].name,
          tools: this.assistants[key].tools as any,
          model: this.assistants[key].model,
          // file_ids: ['file-abc123', 'file-abc456'],
        });
      }
    };

    init();
  }

  public updateAssistant = async (
    instructions = 'You are knowledgeable about the tools available to you. You can ask me to update the tools available to you.',
    assistant_name = 'Morrigu',
    model = 'gpt-4-turbo-2024-04-09',
  ) => {
    this.openai.beta.assistants.update(process.env.DEFAULT_ASSISTANT, {
      instructions: instructions,
      name: assistant_name,
      tools: tools as any,
      model: model,
      // file_ids: ['file-abc123', 'file-abc456'],
    });
  };

  public getAssistant = async (id) => {
    return await this.openai.beta.assistants.retrieve(id);
  };

  public getAssistants = async () => {
    return await this.openai.beta.assistants.list();
  };

  public deleteAssistant = async (id) => {
    return await this.openai.beta.assistants.del(id);
  };
}
