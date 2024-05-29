import { PartialType } from '@nestjs/mapped-types';
import { CreateGenerativeDto } from './create-generative.dto';

export class UpdateGenerativeDto extends PartialType(CreateGenerativeDto) {}
