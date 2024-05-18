import { PartialType } from '@nestjs/mapped-types';
import { CreateAclDto } from './create-acl.dto';

export class UpdateAclDto extends PartialType(CreateAclDto) {}
