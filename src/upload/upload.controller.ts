import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const cloudinaryResult = await this.uploadService.uploadImage(file);
    const uploadRecord = await this.uploadService.saveToDatabase(cloudinaryResult);

    return {
      cloudinary: cloudinaryResult,
      upload: uploadRecord,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new Error('No files provided for upload');
    }
    if (files.length > 10) {
      throw new Error('Maximum 10 files are allowed');
    }

    const cloudinaryResults = await this.uploadService.uploadMultipleImages(files);
    const uploads = await Promise.all(
      cloudinaryResults.map((res) => this.uploadService.saveToDatabase(res)),
    );

    return {
      cloudinary: cloudinaryResults,
      uploads,
    };
  }

  @Delete('delete')
  delete(@Body('publicId') publicId: string) {
    return this.uploadService.deleteImage(publicId);
  }

  // ✅ New endpoint for deleting multiple uploads
  @Delete('multiple')
  async deleteMultipleUploads(@Body() body: { uploadIds: string[] }) {
    if (!body.uploadIds || !Array.isArray(body.uploadIds)) {
      throw new BadRequestException('uploadIds must be an array');
    }

    const result = await this.uploadService.deleteMultipleUploads(body.uploadIds);
    return {
      message: 'Batch deletion completed',
      ...result,
    };
  }
}
