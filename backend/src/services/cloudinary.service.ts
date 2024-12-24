import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    fileData: Buffer,
    fileName: string,
  ): Promise<{ url: string; type: string }> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: 'auto', public_id: fileName },
          (error, result) => {
            if (error) {
              return reject(new InternalServerErrorException(error.message));
            }
            resolve({ url: result.secure_url, type: result.resource_type });
          },
        );

        uploadStream.end(fileData);
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while uploading the file to Cloudinary',
      );
    }
  }
}
