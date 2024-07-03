import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { importJWK, jwtDecrypt } from 'jose';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('DecryptMiddleware.use - Token:', token);
    if (!token) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    try {
      const key = await importJWK(
        {
          kty: 'oct',
          k: process.env.JWT_SECRET,
          alg: 'A256GCM',
        },
        'A256GCM',
      );

      const { payload } = await jwtDecrypt(token, key);
      req['user'] = payload;
      next();
    } catch (error) {
      console.error('DecryptMiddleware.use - Error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
