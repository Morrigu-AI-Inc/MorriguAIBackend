import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { DbModule } from 'src/db/db.module';
import { MediaService } from './media.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaSchema } from 'src/db/schemas/Media';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [DbModule, MediaService],
})
export class MediaModule {}
