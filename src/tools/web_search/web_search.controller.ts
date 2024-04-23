import { Controller, Get, Query } from '@nestjs/common';
import { query } from 'express';

import { ActionsService } from 'src/actions/actions.service';

type GoogleSearchResult = {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: {
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }[];
    nextPage: {
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
      inputEncoding: string;
      outputEncoding: string;
      safe: string;
      cx: string;
    }[];
  };
  context: {
    title: string;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items: {
    kind: string;
    title: string;
    htmlTitle: string;
    link: string;
    displayLink: string;
    snippet: string;
    htmlSnippet: string;
    cacheId: string;
    formattedUrl: string;
    htmlFormattedUrl: string;
  }[];
};

@Controller('tools/web_search')
export class WebSearchController {
  constructor(private readonly actionService: ActionsService) {}

  @Get()
  async searchTools(@Query('query') query: string): Promise<any> {
    console.log('Searching the web', query);

    const urlParams = new URLSearchParams({
      key: process.env.GOOGLE_SEARCH_API,
      cx: process.env.GOOGLE_CX,
      q: query,
    }).toString();

    const googleResults = await fetch(
      `https://www.googleapis.com/customsearch/v1?${urlParams}`,
    )
      .then((response) => response.json())
      .then((data: GoogleSearchResult) => {
        console.log('data', data.items);
        return data;
      });

    return {
      result: {
        tool_name: 'web_search',
        stdout: `
        <SearchResults>
            <SearchResult>
            ${googleResults.items.map((item) => {
              return `
              <Item>
              <title>${item.title}</title>
              <link>${item.link}</link>
              <snippet>${item.snippet}</snippet>
              <htmlTitle>${item.htmlTitle}</htmlTitle>
              <htmlSnippet>${item.htmlSnippet}</htmlSnippet>
              <formattedUrl>${item.formattedUrl}</formattedUrl>
              <htmlFormattedUrl>${item.htmlFormattedUrl}</htmlFormattedUrl>
              </Item>
              `;
            })}
            </SearchResult>
        </SearchResults>
          `,
      },
    };
  }
}
