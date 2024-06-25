import { Module } from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { LangchainController } from './langchain.controller';

@Module({
  controllers: [LangchainController],
  providers: [LangchainService],
})
export class LangchainModule {}
