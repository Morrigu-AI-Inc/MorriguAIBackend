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
      // Define the bucket ARN and a unique S3 key
      const bucketArn = 'dev-morrigu-ai-media';
      const s3_key = new Types.ObjectId().toString();

      // Create a new media document
      const media = await this.mediaService.createMedia({
        name: file.originalname,
        url: `https://${bucketArn}.s3.amazonaws.com/${s3_key}`,
        type: file.mimetype,
        size: file.size,
        s3_key: s3_key,
      });

      if (!media) {
        throw new Error('Error creating media');
      }

      // Create a new S3 client
      const s3 = new S3({
        region: 'us-east-1',
      });

      const params = {
        Bucket: bucketArn,
        Key: s3_key,
        Body: file.buffer,
      };

      // Upload the file to S3
      const response = await s3.send(new PutObjectCommand(params));

      if (!response) {
        // If the file fails to upload, delete the media document
        await this.mediaService.deleteMedia(media._id);

        throw new Error('Error uploading file to S3');
      }

      // Return the response
      return media;
    } catch (error) {
      console.log('Error uploading file to S3:', error);
      // Return the error
      return error;
    }
  }
}
