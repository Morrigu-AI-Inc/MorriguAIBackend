import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialsSchema } from 'src/db/schemas/APICredentials';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Credentials', schema: CredentialsSchema }])
  ],
})
export class ApicredentialsModule {}
