import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromptHistoryDocument, PromptHistorySchema } from '../db/schemas/PromptHistory';

@Injectable()
export class PrompthistoryService {
  constructor(@InjectModel('PromptHistory') private readonly historyModel: Model<PromptHistoryDocument>) {}
}
