import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './upload.entity';

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  original_filename: string;
  bytes: number;
  width?: number;
  height?: number;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  // ✅ EXISTING METHODS (unchanged)
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    try {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'uploads/images', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(new Error(error.message || 'upload failed'));
            else resolve(result as CloudinaryResponse);
          },
        );
        stream.end(file.buffer);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'upload failed';
      throw new InternalServerErrorException(`Image upload failed: ${message}`);
    }
    
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
  ): Promise<CloudinaryResponse[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file));
      return Promise.all(uploadPromises);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'upload failed';
      throw new InternalServerErrorException(`upload failed: ${message}`);
    }
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    try {
      await cloudinary.uploader.destroy(publicId);
      return { result: 'Photo deleted successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'deletion failed';
      throw new InternalServerErrorException(` deletion failed: ${message}`);
    }
  }

  // ✅ NEW METHODS BELOW (for assignment)

  async saveToDatabase(cloudinaryResult: any): Promise<Upload> {
    const upload = this.uploadRepository.create({
      publicId: cloudinaryResult.public_id,
      secureUrl: cloudinaryResult.secure_url,
      originalFilename: cloudinaryResult.original_filename,
      bytes: cloudinaryResult.bytes,
      format: cloudinaryResult.format,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      raw: cloudinaryResult,
    });
    return this.uploadRepository.save(upload);
  }

  async findUploadById(uploadId: string): Promise<Upload> {
    const upload = await this.uploadRepository.findOne({ where: { id: uploadId } });
    if (!upload) throw new NotFoundException(`Upload ${uploadId} not found`);
    return upload;
  }

  async deleteUpload(uploadId: string): Promise<void> {
    const upload = await this.findUploadById(uploadId);
    await cloudinary.uploader.destroy(upload.publicId);
    await this.uploadRepository.delete(uploadId);
  }

  async deleteMultipleUploads(uploadIds: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    for (const id of uploadIds) {
      try {
        await this.deleteUpload(id);
        success.push(id);
      } catch (err) {
        this.logger.error(`Failed to delete upload ${id}: ${err.message}`);
        failed.push(id);
      }
    }

    return { success, failed };
  }
}
