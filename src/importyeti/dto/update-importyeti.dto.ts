import { PartialType } from '@nestjs/swagger';
import { CreateImportyetiDto } from './create-importyeti.dto';

export class UpdateImportyetiDto extends PartialType(CreateImportyetiDto) {}
