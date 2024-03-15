import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelFormattingDocument } from 'src/db/schemas/ModelFormatting';

@Injectable()
export class ModelformattingService {
  constructor(
    @InjectModel('ModelFormatting')
    private readonly modelformattingModel: Model<ModelFormattingDocument>,
  ) {}
}
