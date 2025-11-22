"use strict";

const express = require("express");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");

const { authenticate } = require("../../auth/checkAuth");

// authentication
router.use(authenticate);
router.post("/", asyncHandler(commentController.createComment));
router.get(
  "/:productId",
  asyncHandler(commentController.getCommentsByProductId)
);
router.get("", asyncHandler(commentController.getCommentByParentId));
router.delete("/:commentId", asyncHandler(commentController.deleteComment));
module.exports = router;
