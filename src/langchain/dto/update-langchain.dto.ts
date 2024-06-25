import { PartialType } from '@nestjs/mapped-types';
import { CreateLangchainDto } from './create-langchain.dto';

export class UpdateLangchainDto extends PartialType(CreateLangchainDto) {}
