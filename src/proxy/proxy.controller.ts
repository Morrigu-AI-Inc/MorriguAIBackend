import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import * as yup from 'yup';

/**
 * This controller will be used as a proxy for api integrations.
 *
 *
 */
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('/create')
  async createProxy(@Req() req, @Query() query) {
    try {
      // {
      //   isActive: boolean;
      //   createdAt: Date;
      //   updatedAt: Date;
      //   name: string;
      //   description: string;
      //   settings: {
      //     encryptedData: string;
      //     iv: string;
      //   } // Simplified as encrypted settings string
      //   owner: string; // Simplified as owner string
      // }

      const validation = yup.object().shape({
        isActive: yup.boolean().required(),
        name: yup.string().required(),
        description: yup.string().required(),
        owner: yup.string().required(),
        credentials: yup.object().required(),
      });

      const validBody = await validation.validate(req.body);

      const response = await this.proxyService.createAPIIntegration(
        validBody,
        validBody.credentials,
      );

      // const decryptedSettings =
      //   await this.proxyService.decryptAPIIntegration(response);

      //

      return response;
    } catch (error) {
      if (error instanceof yup.ValidationError)
        return {
          error: error.errors,
        };

      return {
        error: error,
      };
    }
  }

  @Get('/integrations/:integration_name')
  async proxyIntegration(@Param() params) {
    try {
      return {};
    } catch (error) {
      console.error('Error getting Proxy', error);
    }
  }

  // @Post('/:integration/:*')
  @Post('/:integration/')
  async postProxy(@Req() req, @Query() query, @Param() params) {
    try {
      const fetchOps = {
        method: req.method,
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(req.body),
      };

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/${params.integration}`,
        fetchOps,
      );

      const response = await results.json();

      return response;
    } catch (error) {
      console.error('Error posting Proxy', error);
    }
  }
}
