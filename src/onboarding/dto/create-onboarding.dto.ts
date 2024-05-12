import { User } from 'src/db/schemas/User';

export class CreateOnboardingDto {
  user: {
    email: string;
    name: string;
  };
  
  organizationId?: string;
}
