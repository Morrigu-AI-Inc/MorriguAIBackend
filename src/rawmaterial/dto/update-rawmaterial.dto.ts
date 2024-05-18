import { PartialType } from '@nestjs/mapped-types';
import { CreateRawmaterialDto } from './create-rawmaterial.dto';

export class UpdateRawmaterialDto extends PartialType(CreateRawmaterialDto) {}
