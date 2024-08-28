import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PurchasingService } from './purchasing.service';
import { CreatePurchasingDto } from './dto/create-purchasing.dto';
import { UpdatePurchasingDto } from './dto/update-purchasing.dto';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/db/schemas';

@Injectable()
export class HeaderAuthGuard implements CanActivate {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request.headers['authorization'].replace('Bearer ', ''); // JWT token
    const idToken = request.headers['x-id-token'] as string; // JWT token

    if (!accessToken || !idToken) {
      throw new UnauthorizedException('Missing authentication tokens');
    }

    try {
      // Decode the JWT (Base64 decoding)
      const decryptedidToken = Buffer.from(
        idToken.split('.')[1],
        'base64',
      ).toString('utf-8');

      const decrypted = JSON.parse(decryptedidToken);
      const sub = decrypted.sub;

      // Verify the user exists in the database
      const user = this.userModel.findOne({
        id: sub,
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
    } catch (error) {
      console.error('Failed to decode idToken:', error);
      throw new UnauthorizedException('Invalid idToken');
    }

    // Optionally, you can verify the accessToken and idToken here
    // For example, using a JWT library to verify the signature and claims.

    return true;
  }

  
  

}

@Controller('purchasing')
@UseGuards(HeaderAuthGuard)
export class PurchasingController {
  constructor(private readonly purchasingService: PurchasingService) {}

  @Post()
  create(@Body() createPurchasingDto: CreatePurchasingDto) {
    console.log('createPurchasingDto', createPurchasingDto);
    return this.purchasingService.create(createPurchasingDto);
  }

  @Get()
  findAll(@Query('owner') owner: string) {
    return this.purchasingService.findAll(owner);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchasingDto: UpdatePurchasingDto,
  ) {
    return this.purchasingService.update(id, updatePurchasingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasingService.remove(id);
  }
}
