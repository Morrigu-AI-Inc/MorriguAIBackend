import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { query } from 'express';

@Injectable()
export class AuthorizationGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);

      return result as boolean;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Requires authentication');
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}

// decorate for the user entity
export const UserAuth = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    const resp = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: '9428a6b8-cd9f-11ed-afa1-0242ac120002',
          grant_type: 'client_credentials',
        }),
      },
    );

    const json = await resp.json();

    const user = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_DOMAIN,
      }),
    }).catch((err) => {
      console.log(err);
    });

    // const userJson = await user.json();
    // console.log(json, userJson);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log(decoded);
      if (err) {
        throw new UnauthorizedException('Invalid token');
      }
    });

    return json;
  },
);
