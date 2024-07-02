import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MediaDocument } from 'src/db/schemas/Media';
import * as yup from 'yup';

const MediaValidation = yup.object().shape({
  name: yup.string().required(),
  url: yup.string().notRequired(),
  type: yup.string().required(),
  size: yup.number().notRequired(),
  blob: yup.mixed().notRequired(),
  s3_key: yup.string().required(),
});

@Injectable()
export class MediaService {
  constructor(
    @InjectModel('Media') private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async createMedia(mediaData: Partial<MediaDocument>): Promise<MediaDocument> {
    const validated = MediaValidation.validateSync(mediaData, {
      abortEarly: true,
    });

    const newMedia = await this.mediaModel.create(validated);

    return newMedia;
  }

  // Logic to update a specific media by ID
  async updateMedia(mediaData: Partial<MediaDocument>): Promise<MediaDocument> {
    MediaValidation.validateSync(mediaData, {
      abortEarly: true,
    });

    const updatedMedia = await this.mediaModel.findOneAndUpdate(
      { _id: mediaData._id },
      mediaData,
      { new: true },
    );

    return updatedMedia;
  }

  // Logic to delete a specific media by ID
  async deleteMedia(mediaId: string): Promise<MediaDocument> {
    const deletedMedia = await this.mediaModel.findOneAndDelete({
      _id: mediaId,
    });

    return deletedMedia;
  }

  // Logic to get all media
  async getAllMedia(): Promise<MediaDocument[]> {
    const allMedia = await this.mediaModel.find();

    return allMedia;
  }

  async getAllByIds(ids: string[]): Promise<MediaDocument[]> {
    const allMedia = await this.mediaModel.find({ _id: { $in: ids } });

    return allMedia;
  }

  async getMediaBase64(mediaId: string): Promise<string> {
    const media = await this.mediaModel.findOne({ _id: mediaId });

    if (!media) {
      throw new Error('Media not found');
    }

    const image = await fetch(media.url);

    const arrayBuffer = await image.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');

    return base64String;
  }

  async uploadFile(file: any): Promise<MediaDocument | Error> {
    try {
      // Define the bucket ARN and S3 key
      const bucketArn = 'dev-morrigu-ai-media';
      const s3_key =
        new Types.ObjectId().toString() + encodeURIComponent(file.originalname);

      // Create a new media document
      const media = await this.createMedia({
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
        await this.deleteMedia(media._id);

        throw new Error('Error uploading file to S3');
      }

      // Return the response
      return media;
    } catch (error) {
      // Return the error
      return error;
    }
  }
}
