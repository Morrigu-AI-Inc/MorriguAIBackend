import { Injectable } from '@nestjs/common';
import { BedrockService } from 'src/bedrock/bedrock.service';

@Injectable()
export class FunctionCallsService {
  constructor(private readonly bedrockService: BedrockService) {}
  async summarizeSearchResults(
    searchResults: string | string[],
    userSearchResultsRequest?: string,
  ): Promise<string> {
    if (Array.isArray(searchResults)) {
      const system = `When search result are provided to the model, the model will summarize the search results. 
      The user requested the following search results so focus on summarizing this: ${userSearchResultsRequest} \n\n`;

      const prompts = `Here are the search results the user: ${searchResults.join(' ')} \n\n `;

      const summary = await this.bedrockService.InvokeModel(prompts, system);

      return JSON.parse(summary).content[0].text;
    }

    return searchResults;
  }
}
