import { PartialType } from '@nestjs/swagger';
import { CreateUsdaDatumDto } from './create-usda_datum.dto';

export class UpdateUsdaDatumDto extends PartialType(CreateUsdaDatumDto) {}
