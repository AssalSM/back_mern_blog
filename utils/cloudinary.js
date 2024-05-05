const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.COULDINARY_CLOUD_NAME,
  api_key: process.env.COULDINARY_API_KEY,
  api_secret: process.env.COULDINARY_API_SECRET,
});

// cloudinary upload iamge

const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: 'auto',
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("internal server Error (cloudinary)")
  }
};

//  remove image

const cloudinaryRomveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("internal server Error (cloudinary)")
  }
};

//  remove multiple image

const cloudinaryRomveMultipleImage = async (PublicIds) => {
  try {
    const result = await cloudinary.v2.api.delete_all_resources(PublicIds)
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("internal server Error (cloudinary)")
  }
};
module.exports = {
  cloudinaryRomveImage,
  cloudinaryUploadImage,
  cloudinaryRomveMultipleImage
};
