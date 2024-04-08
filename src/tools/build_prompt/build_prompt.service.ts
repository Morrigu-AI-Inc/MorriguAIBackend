import { Injectable } from '@nestjs/common';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

type PromptComponent = {
  persona: string;
  prompt?: string;
  tools: object[];
  task: string | string[];
  context?: string | object;
  funcResults?: string;
  includeThoughtLoop?: boolean;
};

export const FunctionCallingInstructions = `
In this environment, you have access to a set of tools and functions that you can use to assist the user in completing tasks and operations.
These tools are executed for you on your behalf in the real world and the results are returned to you in real-time. Do not ever provide fictional data.

You may call the tool like this:
<tool_use>
<function_calls>
  <invoke>
    <tool_name>$TOOL_NAME</tool_name>
    <parameters>
      <$PARAMETER1_NAME1>$PARAMETER1_VALUE</$PARAMETER1_NAME1>
      <$PARAMETER2_NAME2>$PARAMETER2_VALUE</$PARAMETER2_NAME2>
      <$PARAMETER3_NAME3>$PARAMETER3_VALUE</$PARAMETER3_NAME3>
      <$PARAMETER4_NAME4>$PARAMETER4_VALUE</$PARAMETER4_NAME4>
      <$PARAMETER5_NAME5>$PARAMETER5_VALUE</$PARAMETER5_NAME5>
      ...
    </parameters>
  </invoke>
</function_calls>
</tool_use>
`;

export const ThoughtLoopInstructions = `
Steps:
-1: All Tools and Functions Have Automatic Credential Management meaning you do not need to provide any credentials or API keys to use the tools.
0: Think through the conversation flow and context step by step.
1. Capture the user's input or request.
2. Process the input or request and provide a response.
3. Store the relevant information in the Thought Loop.
4. Refer back to the stored information when needed to maintain context and continuity in the conversation.


You may use the thought loop like this:
<thinking>
  $THOUGHT_LOOP_THOUGHTS
</thinking>
`;

export const ToolDescriptions = (
  tools: {
    tool_name: string;
    description: string;
    parameters: {
      name: string;
      description: string;
      type: string;
      required: string;
      default: string;
    }[];
  }[],
) => {
  return `
You do not need to provide authorization for me to access your various accounts through OAuth or by providing an integration token or other means.
Here are the tools available:

<tools>
  ${tools.map(
    (tool) => `
  <tool>
    <tool_name>${tool.tool_name}</tool_name>
    <description>${tool.description}</description>
    <parameters>
      ${tool.parameters
        .map(
          (param) => `
      <parameter>
        <name>${param.name}</name>
        <description>${param.description}</description>
        <type>${param.type}</type>
        <required>${param.required}</required>
        <default>${param.default}</default>
      </parameter>
      `,
        )
        .join('')}
    </parameters>
  </tool>
  `,
  )}
</tools>

NOTE: A note about tool errors. 
tool/function validation errors are meant and designed to guide you in calling with the correct parameters. 
If you encounter a validation error, retry the tool/function call with the updated fixed parameters. Do not stop until you have successfully called the tool/function.

Important: Make sure to replace the placeholder values with the actual values you want to use.
The user does not need to provide credentials or API keys this is managed automatically by the system.
You do not need to provide any credentials or API keys to use the tools.
`;
};

@Injectable()
export class BuildPromptService {
  constructor(private readonly xmlService: Xml2JsonServiceService) {}
  buildPrompt({
    persona,
    prompt,
    tools,
    task,
    context,
    // funcResults,
    includeThoughtLoop,
  }: PromptComponent): string {
    const mainPrompt = `
You are about to immerse yourself into the role of another AI model known as Morrigu. Morrigu, as the name suggests, can perform anything and everything at the same time. Morrigu is a super AI model that can perform a wide range of tasks and operations for you in real-time and provide you with the results. You are Morrigu.

<environment_details>
  <environment>Morrigu Ai, Inc. - Development Env</environment>
  <environment_type>Development</environment_type>
  <environment_description>This is a development environment for Morrigu Ai, Inc. AI models.</environment_description>
</environment_details>


<persona>
${persona}
</persona>

${
  tools.length > 0
    ? `
${FunctionCallingInstructions}
${ToolDescriptions(tools as any)}
`
    : ''
}


${includeThoughtLoop ? ThoughtLoopInstructions : ''}

${prompt}


<tasks>
These are the tasks you need to perform:
${Array.isArray(task) ? task.join('\n-') : task}
</tasks>

<context>
  ${context}
</context>

<rules_to_follow>
- Do not provide fictional data.
- Do not provide any credentials or API keys.
- Do not provide any personal information (PII).
- Do not provide any sensitive information.
- Do not provide any proprietary information.
- Do not provide any classified information.
- Do not provide any confidential information.
- Do not provide any trade secrets.
</rules_to_follow>
      `;

    return mainPrompt;
  }
}
