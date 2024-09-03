import { PartialType } from '@nestjs/swagger';
import { CreateAmazonDto } from './create-amazon.dto';

export class UpdateAmazonDto extends PartialType(CreateAmazonDto) {}
