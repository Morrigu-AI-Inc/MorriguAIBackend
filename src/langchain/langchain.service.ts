import { Injectable } from '@nestjs/common';
import { CreateLangchainDto } from './dto/create-langchain.dto';
import { UpdateLangchainDto } from './dto/update-langchain.dto';
import { HumanMessage } from '@langchain/core/messages';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { ChatOpenAI } from '@langchain/openai';
import { END, START, StateGraph, StateGraphArgs } from '@langchain/langgraph';
import { MemorySaver } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';

interface AgentState {
  messages: HumanMessage[];
}

// Define the graph state

@Injectable()
export class LangchainService {
  private model: any;
  private tools: any[];

  constructor() {}

  runWorkflow = async () => {
    const checkpointer = new MemorySaver();
    const graph = {
      messages: {
        value: (x: HumanMessage[], y: HumanMessage[]) => x.concat(y),
        default: () => [],
      },
    };

    const tools = [new TavilySearchResults({ maxResults: 1 })]; // crap at getting search results

    const toolNode = new ToolNode<AgentState>(tools);
    const workflow = new StateGraph<AgentState>({ channels: graph })
      .addNode('agent', this.callModel)
      .addNode('tools', toolNode)
      .addEdge(START, 'agent')
      .addConditionalEdges('agent', this.shouldContinue)
      .addEdge('tools', 'agent');

    const app = workflow.compile({
      checkpointer,
    });

    //

    const finalState = await app

      .invoke(
        {
          messages: [
            new HumanMessage(
              'What is the current stock price for AAPL for today (june 13th 2024)?',
            ),
          ],
        },
        { configurable: { thread_id: '42' } },
      )
      .catch((e) => console.error(e));

    return finalState;
  };

  shouldContinue(state: AgentState): 'tools' | typeof END {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.additional_kwargs.tool_calls) {
      return 'tools';
    }

    return END;
  }

  async callModel(state: AgentState) {
    const tools = [new TavilySearchResults({ maxResults: 1 })];
    const model = new ChatOpenAI({ temperature: 0, model: 'gpt-4o' }).bindTools(
      tools,
    );
    const messages = state.messages;
    const response = await model.invoke(messages);

    // We return a list, because this will get added to the existing list
    return { messages: [response] };
  }

  create(createLangchainDto: CreateLangchainDto) {
    return 'This action adds a new langchain';
  }

  findAll() {
    return `This action returns all langchain`;
  }

  findOne(id: number) {
    return `This action returns a #${id} langchain`;
  }

  update(id: number, updateLangchainDto: UpdateLangchainDto) {
    return `This action updates a #${id} langchain`;
  }

  remove(id: number) {
    return `This action removes a #${id} langchain`;
  }
}
