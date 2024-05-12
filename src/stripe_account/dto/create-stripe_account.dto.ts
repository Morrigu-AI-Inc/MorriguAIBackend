import { Address } from 'src/db/schemas/Address';
import { User } from 'src/db/schemas/User';
export class CreateStripeAccountDto {
  user: {
    _id: string;
    email: string;
    name: string;
  };
  address: Address;
}
