// import { Injectable } from '@nestjs/common';
// import * as cloudinary from 'cloudinary';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class CloudinaryService {
//   constructor(private configService: ConfigService) {
//     cloudinary.v2.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//     });
//   }

//   async uploadFile(fileData: Buffer, fileName: string) {
//     try {
//       const uploadResponse = await cloudinary.v2.uploader.upload_stream(
//         { resource_type: 'auto', public_id: fileName },
//         (error, result) => {
//           if (error) {
//             throw error;
//           }
//             return result;
//         },
//       );

//       // Pass the file data to Cloudinary
//       uploadResponse.end(fileData);

//       return uploadResponse; // This will return the result of the upload (e.g., URL)
//     } catch (error) {
//       console.error('Error uploading to Cloudinary:', error);
//       throw error;
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    fileData: Buffer,
    fileName: string,
  ): Promise<{ url: string; type: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { resource_type: 'auto', public_id: fileName },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve({ url: result.secure_url, type: result.resource_type }); // Resolve the promise with the file URL
        },
      );

      uploadStream.end(fileData); // Send the file data to the Cloudinary upload stream
    });
  }
}
