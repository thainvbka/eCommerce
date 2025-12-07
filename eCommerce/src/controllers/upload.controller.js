"use strict";

const { SuccessResponse } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
} = require("../services/upload.service");
const { uploadImageFromLocalS3 } = require("../services/upload.aws.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "File uploaded successfully",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileLocal = async (req, res, next) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }
    new SuccessResponse({
      message: "File uploaded to local successfully",
      metadata: await uploadImageFromLocal(file.path),
    }).send(res);
  };

  //upload to s3
  uploadFileLocalS3 = async (req, res, next) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    new SuccessResponse({
      message: "File uploaded to S3 successfully",
      metadata: await uploadImageFromLocalS3({ file }),
    }).send(res);
  };
}

module.exports = new UploadController();
