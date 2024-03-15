import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ModelDocument } from 'src/db/schemas/Model';
import { PromptDocument } from 'src/db/schemas/Prompt';
import { PromptFlagDocument } from 'src/db/schemas/PromptFlag';
import { PromptHistoryDocument } from 'src/db/schemas/PromptHistory';
import { QueryResponseDocument } from 'src/db/schemas/QueryResponse';

@Injectable()
export class PromptflagService {
  private logger = new Logger('PromptFlagService');
  constructor(
    @InjectModel('PromptFlag')
    private promptFlagModel: Model<PromptFlagDocument>,

    @InjectModel('ModelFormatting')
    private modelFormattingModel: Model<ModelDocument>,

    @InjectModel('PromptHistory')
    private historyModel: Model<PromptHistoryDocument>,

    @InjectModel('QueryResponsePair')
    private queryResponsePairModel: Model<QueryResponseDocument>,
  ) {}

  async findOne(_id: string, env: string, historyId?: string) {
    const flag = await this.promptFlagModel
      .findOne({
        _id: new Types.ObjectId(_id),
        environment: new Types.ObjectId(env),
      })
      .populate({
        path: 'promptId',
        populate: {
          path: 'modelId',
        },
      });

    const prompt = flag?.promptId as unknown as PromptDocument;
    const model = prompt.modelId as unknown as ModelDocument;

    const formattings = await this.modelFormattingModel.findOne({
      _id: new Types.ObjectId(model?.model_formatting),
    });

    const inf_params = model?.inference_params as unknown as {};

    const history = await this.historyModel
      .findOne({
        _id: new Types.ObjectId(historyId),
      })
      .populate({
        path: 'history',
        model: 'QueryResponsePair',
        populate: {
          path: 'query response',
        },
      });

    return {
      flag: flag,
      prompt: prompt,
      model: model,
      formattings: formattings,
      inf_params: inf_params,
      history: history.history,
    };
  }
}
