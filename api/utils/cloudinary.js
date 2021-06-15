import cloudinary from 'cloudinary';
import { v4 as uuid } from 'uuid';

cloudinary.config({
    cloud_name: 'dkkf9iqnd',
    api_key: '345283128864692',
    api_secret: 'lx3iSxt-1c_LO5ma3P_RLT8TF3Q',
});

/**
 *  Uploads file to Cloudinary CDN
 *
 *  @param {stream} object, image streaming content
 *  @param {folder} string, folder name, where to save image
 *  @param {string} imagePublicId
 */
export const uploadToCloudinary = async(stream, folder, imagePublicId) => {
    // if imagePublicId param is presented we should overwrite the image
    const options = imagePublicId ? { public_id: imagePublicId, overwrite: true } : { public_id: `${folder}/${uuid()}` };

    return new Promise((resolve, reject) => {
        const streamLoad = cloudinary.v2.uploader.upload_stream(options, (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });

        stream.pipe(streamLoad);
    });
};

/**
 *  Deletes file from Cloudinary CDN
 *
 *  @param {string} publicId id for deleting the image
 */
export const deleteFromCloudinary = async(publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(publicId, (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};