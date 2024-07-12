import { PartialType } from '@nestjs/swagger';
import { CreateFsisMpiSearchDto } from './create-fsis_mpi_search.dto';

export class UpdateFsisMpiSearchDto extends PartialType(CreateFsisMpiSearchDto) {}
