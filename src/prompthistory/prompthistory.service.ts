import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromptHistoryDocument } from '../db/schemas/PromptHistory';
import { QueryDocument } from 'src/db/schemas/Query';
import { QueryResponsePairDocument } from 'src/db/schemas/QueryResponsePair';
import { QueryResponseDocument } from 'src/db/schemas/QueryResponse';
import { HistoryDocument } from 'src/db/schemas/ConversationHistory';

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

  async updateHistory(
    id: string,
    history: Partial<PromptHistoryDocument>,
  ): Promise<PromptHistoryDocument> {
    const updatedHistory = await this.historyModel.findOneAndUpdate(
      {
        _id: id,
      },
      history,
      {
        new: true,
      },
    );
    return updatedHistory;
  }

  async getHistoryById(id: string): Promise<Partial<PromptHistoryDocument>> {
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

  async getStreamAbleHistoryById(
    id: string,
  ): Promise<Partial<PromptHistoryDocument>> {
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
      })
      .then((history) => {
        const his = {
          _id: history._id,
          chatHistory: history.chatHistory.map((h) => {
            if (h.content.length === 0) {
              return {
                role: h.role,
                content: [
                  {
                    type: 'text',
                    text: '<empty></empty>',
                  },
                ],
              };
            }
            return {
              role: h.role,
              content: h.content.map((c) => {
                if (c.type !== 'image' && c.type !== 'text') {
                  return {
                    type: 'text',
                    text: JSON.stringify(c).trim(),
                  };
                }

                return {
                  type: c.type,
                  text: c.text.trim() || '<empty></empty>',
                };
              }),
            };
          }),
        };

        const tempChats = [];

        // we need to ensure they alternate between user and assistant
        for (const chat of history.chatHistory) {
          if (tempChats[tempChats.length - 1]?.role === chat.role) {
            tempChats.push({
              role: chat.role === 'user' ? 'assistant' : 'user',
              content: [
                {
                  type: 'text',
                  text: '<empty></empty>',
                },
              ],
            });
          }

          tempChats.push({
            role: chat.role,
            content:
              chat.content.length > 0
                ? chat.content
                : [
                    {
                      type: 'text',
                      text: '<empty></empty>',
                    },
                  ],
          });
        }

        his.chatHistory = tempChats;

        return his;
      });

    return history as Partial<PromptHistoryDocument>;
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

    await history.save();

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

    if (
      history.chatHistory[history.chatHistory.length - 1].role === 'assistant'
    ) {
      history.chatHistory[history.chatHistory.length - 1].content = [
        ...history.chatHistory[history.chatHistory.length - 1].content,
        {
          type: 'text',
          text: response.body?.['text'],
        },
      ];
    } else {
      history.chatHistory.push({
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: response.body?.['text'],
          },
        ],
      });
    }

    // in this one we find the last pair in the history and update the queryresponse

    await history.save();

    return history;
  }
}
