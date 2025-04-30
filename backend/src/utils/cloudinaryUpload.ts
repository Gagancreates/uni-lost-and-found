import { UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import cloudinary from '../config/cloudinary';

/**
 * Uploads a file to Cloudinary and returns the image URL
 * 
 * @param filePath - Path to the local file
 * @param folder - Cloudinary folder to store the image
 * @returns Promise containing the upload result
 */
export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'lost-and-found'
): Promise<UploadApiResponse> => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });

    // Remove the local file
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    // Remove the local file in case of error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

export default uploadToCloudinary; 