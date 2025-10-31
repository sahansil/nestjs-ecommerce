import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { v2 as cloudinary } from 'cloudinary';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';

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
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dyigjybua',
          api_key: process.env.CLOUDINARY_API_KEY || '444512872377633',
          api_secret: process.env.CLOUDINARY_API_SECRET || 'GUJJFmo_J90HUb7YtA1PxGroqko',
        });
      },
    },
    UploadService,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
