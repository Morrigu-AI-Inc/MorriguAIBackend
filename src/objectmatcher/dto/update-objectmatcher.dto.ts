import { PartialType } from '@nestjs/swagger';
import { CreateObjectmatcherDto } from './create-objectmatcher.dto';

export class UpdateObjectmatcherDto extends PartialType(CreateObjectmatcherDto) {}
