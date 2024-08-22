import { PartialType } from '@nestjs/swagger';
import { CreateNassDto } from './create-nass.dto';

export class UpdateNassDto extends PartialType(CreateNassDto) {}
