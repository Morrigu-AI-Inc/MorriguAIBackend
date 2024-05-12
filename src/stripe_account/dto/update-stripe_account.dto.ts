import { PartialType } from '@nestjs/mapped-types';
import { CreateStripeAccountDto } from './create-stripe_account.dto';

export class UpdateStripeAccountDto extends PartialType(CreateStripeAccountDto) {}
