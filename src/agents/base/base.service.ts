import { Injectable } from '@nestjs/common';

// let's design a base agent service that will be extended by other services
/**
 * Base agent service interface
 *
 * Documentation:
 * - A agent is an llm that is sent to do a task.
 * - A base agent has common functionality or properties like engine (anthropic/openai/etc.)
 *
 * What do we need to create a base agent service?
 * - We need to create a base agent service interface
 *
 */
export type IBaseAgentService = {
  task: string;
  personality: string;
  
};

@Injectable()
export class BaseService {}
