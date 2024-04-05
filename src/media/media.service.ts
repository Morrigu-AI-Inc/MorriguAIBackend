import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaDocument } from 'src/db/schemas/Media';
import * as yup from 'yup';

// @Prop({ required: true })
//   name: string;

//   @Prop({ required: true })
//   url: string;

//   @Prop({ required: true })
//   type: string;

//   @Prop({ required: true })
//   size: number;

//   @Prop({ required: false })
//   blob: Buffer;

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
}
