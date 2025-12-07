"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { uploadDisk } = require("../../configs/multer.config");

// router.use(authenticate);

router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/thumbnail",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileLocal)
);

module.exports = router;
