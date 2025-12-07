"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { uploadDisk, uploaddMemory } = require("../../configs/multer.config");

// router.use(authenticate);

router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/thumbnail",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileLocal)
);

//upload to s3
router.post(
  "/product/thumbnail-s3",
  uploaddMemory.single("file"),
  asyncHandler(uploadController.uploadFileLocalS3)
);

module.exports = router;
