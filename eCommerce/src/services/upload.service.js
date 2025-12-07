"use strict";

const cloudinary = require("../configs/cloudinary.config");

// 1. upload from url_image
const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://scontent.cdninstagram.com/v/t51.82787-15/589435854_17883744648418184_4352812746834193693_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzc4MTMxNzIzNTk5NTUzMTY3OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTU4Mi5zZHIuQzMifQ%3D%3D&_nc_ohc=h3GGY6jOt5gQ7kNvwH2a-Ns&_nc_oc=AdmQqqHXwpuYnvRrn0HHNa_7Xh3LwqmjNzXDJ_meLtE4QDxxS698k7i3sCZNJ3zNNB8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=iivBg9fNlxwcZtuqH1kksg&oh=00_Afk5hPtvptHdPcZjSIdqCuMFqJ4YQj0Q1BiGl6XYP7hyFg&oe=693AC2C1";
    const folderName = "product/shopId",
      newFileName = "testdemo";

    const result = await cloudinary.uploader.upload(urlImage, {
      // public_id: newFileName
      folder: folderName,
    });

    console.log(result);
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

//upload from local
const uploadImageFromLocal = async (filePath) => {
  try {
    const folderName = "product/shopId",
      newFileName = "testdemo";

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: newFileName,
      folder: folderName,
    });

    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: "shopId",
      thumb_url: await cloudinary.url(result.public_id, {
        width: 200,
        height: 200,
        Crop: "fill",
      }),
    };
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
};
