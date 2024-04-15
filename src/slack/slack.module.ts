import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackController } from './slack.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalSlackMappingSchema } from 'src/db/schemas/ExternalSlackMapping';

@Module({
  providers: [SlackService, OpenaiService],
  controllers: [SlackController],
  imports: [
    MongooseModule.forFeature([
      { name: 'ExternalSlackMapping', schema: ExternalSlackMappingSchema },
    ]),
  ],
})
export class SlackModule {}
