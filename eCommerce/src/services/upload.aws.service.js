"use strict";

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const randomImageName = () => crypto.randomBytes(16).toString("hex");
const urlImagePublic = "https://d305knk1dcbdfh.cloudfront.net";

const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await S3Client.send(command);

    const signedUrl = await new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });

    const url = await getSignedUrl(S3Client, signedUrl, { expiresIn: 3600 });

    return {
      image_url: `${urlImagePublic}/${imageName}`,
      result,
    };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
};

module.exports = {
  uploadImageFromLocalS3,
};
