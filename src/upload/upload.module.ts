import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { v2 as cloudinary } from 'cloudinary';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import config from 'src/config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        cb(allowed.includes(file.mimetype) ? null : new Error('Invalid file type'), true);
      },
    }),
  ],
  providers: [
    {
      provide: 'CLOUDINARY_CONFIG',
      useFactory: () => {
        cloudinary.config({
          cloud_name: config().cloudinary.cloudName,
          api_key: config().cloudinary.apiKey,
          api_secret: config().cloudinary.apiSecret,
        });
      },
    },
    UploadService,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
