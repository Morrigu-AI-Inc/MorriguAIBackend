import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth0Strategy } from './auth0.strategy';

@Module({
  providers: [AuthService, Auth0Strategy]
})
export class AuthModule {}
