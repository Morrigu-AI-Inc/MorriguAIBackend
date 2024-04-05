import { Injectable } from '@nestjs/common';
import { SearchService } from './search/search.service';
import { InjectModel } from '@nestjs/mongoose';
import { ToolDocument } from 'src/db/schemas/Tools';
import { Model } from 'mongoose';

@Injectable()
export class ToolsService {
  constructor(
    @InjectModel('ToolDescription')
    private readonly toolModel: Model<ToolDocument>,
  ) {}

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
