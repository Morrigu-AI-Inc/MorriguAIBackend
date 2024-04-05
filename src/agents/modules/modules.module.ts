import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { BedrockService } from 'src/bedrock/bedrock.service';
import { BedrockModule } from 'src/bedrock/bedrock.module';

@Module({
  providers: [ModulesService, BedrockService],
  imports: [BedrockModule],
})
export class ModulesModule {}
