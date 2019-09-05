import cloudinary from 'cloudinary';
import env from '../middleware/ENV.json';

cloudinary.config({
    cloud_name: env.cloud_name,
    api_key: env.api_key,
    api_secret: env.api_secret,
  });

//async/await is used here to ensure that file uploads before the next function happens
export const addProfilePicture = async (filename) => {
        try {
            let upload = await cloudinary.uploader.upload(filename,
                {resource_type: "image",folder: "ProfilePictures", use_filename: true});
            return upload;
        } catch (error) {
            return {
                message: "Could not upload image",
                error
            };
        }
    };

    export const deleteImage = async (publicId) => {
        try {
            let upload = await cloudinary.uploader.destroy(publicId,
                {resource_type: "image"});
            return upload;
        } catch (error) {
            return error;
        }
    }