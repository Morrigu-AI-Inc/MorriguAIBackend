import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { OrganizationACLSchema, UserACLSchema } from 'src/db/schemas/ACL';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OrganizationACL', schema: OrganizationACLSchema },
      { name: 'UserACL', schema: UserACLSchema },
    ]),
  ],
})
export class AclModule {}
