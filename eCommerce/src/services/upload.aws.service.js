"use strict";

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("../configs/s3.config");

// Import the getSignedUrl function from AWS SDK v3
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// Import the getSignedUrl function from the AWS CloudFront Signer
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const crypto = require("crypto");

const randomImageName = () => crypto.randomBytes(16).toString("hex");
// URL CloudFront public để truy cập hình ảnh thay cho URL S3 trực tiếp
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

    // singedUrl là URL tạm thời để truy cập file trong S3
    // const signedUrl = await new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: imageName,
    // });

    // url là URL có thể truy cập trong thời gian nhất định, nhưng không phải là URL công khai vĩnh viễn vì S3 bucket có thể được cấu hình là riêng tư
    // đây là dùng của AWS SDK v3 để tạo URL có thời hạn truy cập S3
    // const url = await getSignedUrl(S3Client, signedUrl, { expiresIn: 3600 });

    // Sử dụng AWS CloudFront Signer để tạo URL có chữ ký giới hạn thời gian truy cập
    const signedUrl = getSignedUrl({
      url: `${urlImagePublic}/${imageName}`,
      keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID,
      dateLessThan: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
    });

    return {
      //image_url: là URL công khai vĩnh viễn thông qua CloudFront
      signedUrl,
      result,
    };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
};

module.exports = {
  uploadImageFromLocalS3,
};
