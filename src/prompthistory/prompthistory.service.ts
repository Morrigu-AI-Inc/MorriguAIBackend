import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromptHistoryDocument } from '../db/schemas/PromptHistory';
import { QueryDocument } from 'src/db/schemas/Query';
import { QueryResponsePairDocument } from 'src/db/schemas/QueryResponsePair';
import { QueryResponseDocument } from 'src/db/schemas/QueryResponse';

@Injectable()
export class PrompthistoryService {
  constructor(
    @InjectModel('PromptHistory')
    private readonly historyModel: Model<PromptHistoryDocument>,

    @InjectModel('Query')
    private readonly queryModel: Model<QueryDocument>,

    @InjectModel('QueryResponsePair')
    private readonly queryResponsePairModel: Model<QueryResponsePairDocument>,

    @InjectModel('QueryResponse')
    private readonly queryResponseModel: Model<QueryResponseDocument>,
  ) {}

  async createHistory(
    history: Partial<PromptHistoryDocument>,
  ): Promise<PromptHistoryDocument> {
    const newHistory = await this.historyModel.create(history);
    return newHistory;
  }

  async getHistoryById(id: string): Promise<PromptHistoryDocument> {
    const history = await this.historyModel
      .findOne({
        _id: id,
      })
      .populate({
        path: 'history',
        model: 'QueryResponsePair',
        populate: [
          {
            path: 'query',
            model: 'Query',
          },
          {
            path: 'response',
            model: 'QueryResponse',
          },
        ],
      });
    return history;
  }

  async appendQueryToHistory(
    id,
    query: Partial<QueryDocument>,
  ): Promise<Partial<PromptHistoryDocument>> {
    const history = await this.historyModel.findOne({
      _id: id,
    });

    if (!history) {
      throw new Error('History not found');
    }

    const newQuery = await this.queryModel.create(query);

    const newPair = await this.queryResponsePairModel.create({
      query: newQuery._id,
    });

    history.history.push(newPair._id);
    await history.save();

    return await this.historyModel
      .findOne({
        _id: id,
      })
      .populate({
        path: 'history',
        model: 'QueryResponsePair',
        populate: [
          {
            path: 'query',
            model: 'Query',
          },
          {
            path: 'response',
            model: 'QueryResponse',
          },
        ],
      });
  }

  async appendResponseToHistory(id, response: Partial<QueryResponseDocument>) {
    const history = await this.historyModel.findOne({
      _id: id,
    });

    if (!history) {
      throw new Error('History not found');
    }

    const newResponse = await this.queryResponseModel.create(response);

    // in this one we find the last pair in the history and update the queryresponse

    const lastPair = await this.queryResponsePairModel.findOne({
      _id: history.history[history.history.length - 1],
    });

    if (!lastPair) {
      throw new Error('Pair not found');
    }

    lastPair.response = newResponse._id;
    await lastPair.save();

    await history.save();

    return newResponse;
  }
}
