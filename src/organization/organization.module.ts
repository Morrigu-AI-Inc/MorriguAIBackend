import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from 'src/db/schemas/Organization';
import { OrganizationService } from './organization.service';
import { UserSchema } from 'src/db/schemas/User';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [OrganizationService],
})
export class OrganizationModule {}
