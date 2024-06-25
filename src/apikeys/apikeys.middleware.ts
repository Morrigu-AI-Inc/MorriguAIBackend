import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['rigu-api-key'];

    // We Will eventually use this to check for API keys

    // if (!apiKey) {
    //   throw new UnauthorizedException('API key is missing');
    // }

    // if (apiKey !== process.env.API_KEY) {
    //   throw new UnauthorizedException('Invalid API key');
    // }

    next();
  }
}
