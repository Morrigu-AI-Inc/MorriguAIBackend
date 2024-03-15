import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-auth0';
import { Profile } from 'passport';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      state: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, extraParams: any, profile: Profile, done: VerifyCallback): Promise<any> {
    // Here you could enrich the user's profile, check against a database, etc.
    return done(null, profile);
  }
}
