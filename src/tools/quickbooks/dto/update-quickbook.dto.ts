import { PartialType } from '@nestjs/mapped-types';
import { CreateQuickbookDto } from './create-quickbook.dto';

export class UpdateQuickbookDto extends PartialType(CreateQuickbookDto) {}
