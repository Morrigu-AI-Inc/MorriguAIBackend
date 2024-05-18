import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth0Strategy, JwtStrategy } from './auth0.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JwtStrategy, AuthService, Auth0Strategy],
  exports: [PassportModule],
})
export class AuthModule {}
