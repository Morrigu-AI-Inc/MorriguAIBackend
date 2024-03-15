import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelFormattingSchema } from 'src/db/schemas/ModelFormatting';
import PromptFlag from 'src/db/schemas/PromptFlag';
import { PromptHistorySchema } from 'src/db/schemas/PromptHistory';
import { QueryResponsePairSchema } from 'src/db/schemas/QueryResponsePair';
import { ModelformattingService } from 'src/modelformatting/modelformatting.service';
import { PromptflagService } from 'src/promptflag/promptflag.service';

@Module({
  providers: [PromptflagService, ModelformattingService],
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: 'PromptFlag', schema: PromptFlag }]),
    MongooseModule.forFeature([
      { name: 'ModelFormatting', schema: ModelFormattingSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'PromptHistory', schema: PromptHistorySchema },
    ]),

    MongooseModule.forFeature([
      { name: 'QueryResponsePair', schema: QueryResponsePairSchema },
    ]),
  ],
  exports: [],
})
export class BedrockModule {}
