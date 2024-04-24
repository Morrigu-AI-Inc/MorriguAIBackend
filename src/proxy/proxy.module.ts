import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APIIntegrationSchema } from 'src/db/schemas/APIIntegration';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'APIIntegration',
        schema: APIIntegrationSchema,
      },
    ]),
  ],
})
export class ProxyModule {}
