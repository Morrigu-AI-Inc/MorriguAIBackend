import { PartialType } from '@nestjs/swagger';
import { CreateFsiDto } from './create-fsi.dto';

export class UpdateFsiDto extends PartialType(CreateFsiDto) {}
