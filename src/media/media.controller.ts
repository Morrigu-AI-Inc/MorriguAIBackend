import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaDocument } from 'src/db/schemas/Media';
import { FileInterceptor } from '@nestjs/platform-express';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Types } from 'mongoose';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // Logic to create a new media
  @Get()
  async getAllMedia() {
    try {
      return this.mediaService.getAllMedia();
    } catch (error) {
      return error;
    }
  }

  // Logic to update a specific media by ID
  @Put(':id')
  async updateMedia(
    @Param('id') id: string,
    @Body() listingData: Partial<MediaDocument>,
  ): Promise<Partial<MediaDocument>> {
    try {
      return this.mediaService.updateMedia(listingData);
    } catch (error) {
      return error;
    }
  }

  // Logic to delete a specific media by ID
  @Delete(':id')
  async deleteMedia(@Param('id') id: string): Promise<Partial<MediaDocument>> {
    try {
      return this.mediaService.deleteMedia(id);
    } catch (error) {
      return error;
    }
  }

  // Logic to create a new media
  @Post()
  async createMedia(
    @Body() mediaData: Partial<MediaDocument>,
  ): Promise<Partial<MediaDocument>> {
    try {
      return this.mediaService.createMedia(mediaData);
    } catch (error) {
      return error;
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToS3(@UploadedFile() file): Promise<Partial<MediaDocument>> {
    try {
      return this.mediaService.uploadFile(file);
    } catch (error) {
      return error
    }
  }
}
