import { Module } from '@nestjs/common';
import { V1Service } from './v1.service';
import { V1Controller } from './v1.controller';
import { PlatformModule } from './platform/platform.module';

@Module({
  controllers: [V1Controller],
  providers: [V1Service],
  imports: [PlatformModule],
})
export class V1Module {}
