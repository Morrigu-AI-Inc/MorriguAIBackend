import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentSchema } from 'src/db/schemas/Environment';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Environment', schema: EnvironmentSchema },
    ]),
  ],
})
export class EnvironmentModule {}
