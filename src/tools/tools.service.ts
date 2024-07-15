import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { ToolDocument } from 'src/db/schemas/Tools';
import { Model } from 'mongoose';

@Injectable()
export class ToolsService {
  constructor(
    @InjectModel('ToolDescription')
    private readonly toolModel: Model<ToolDocument>,
  ) {}

  async updateTool(tool: Partial<ToolDocument>): Promise<ToolDocument> {
    const foundTool = await this.toolModel.findOne({ name: tool.name });

    console.log('foundTool', foundTool);

    if (!foundTool) {
      return this.toolModel.create(tool);
    }

    return this.toolModel
      .findOneAndUpdate({ name: tool.name }, tool, { new: true })
      .exec();
  }

  async searchToolsV2(
    searchTerm: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    totalCount: number;
    totalPages: number;
    currentPage: number;
    results: ToolDocument[];
  }> {
    console.log('searchTerm', searchTerm);
    const aggregation = [
      {
        $search: {
          index: 'tools', // Use the actual name of your Atlas search index
          text: {
            query: searchTerm,
            path: {
              wildcard: '*',
            },
          },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    const results = await this.toolModel.aggregate(aggregation).exec();
    const totalCount = results.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return {
      totalCount,
      totalPages,
      currentPage: page,
      results: paginatedResults,
    };
  }

  async searchTools(searchTerm: string): Promise<ToolDocument[]> {
    console.log('searchTerm', searchTerm);
    const aggregation = [
      {
        $search: {
          index: 'tools', // Use the actual name of your Atlas search index
          compound: {
            should: [
              {
                text: {
                  query: searchTerm,
                  path: 'tool_name', // Searches in tool_name
                  score: { boost: { value: 2 } }, // Optional, boosts relevance score for matches in tool_name
                },
              },
              {
                text: {
                  query: searchTerm,
                  path: 'description', // Searches in description
                  score: { boost: { value: 3 } }, // Optional, boosts relevance score for matches in tool_name
                },
              },
            ],
          },
        },
      },
      {
        $limit: 10, // Adjust based on your needs
      },
    ];

    return this.toolModel.aggregate(aggregation).exec();
  }
}
