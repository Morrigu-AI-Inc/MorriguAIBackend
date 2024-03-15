import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/db/schemas/User';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema}
  ])],
})
export class UserModule {}
