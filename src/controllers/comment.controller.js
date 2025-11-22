"use strict";
const {
  createComment,
  getCommentsByProductId,
  getCommentByParentId,
  deleteComment,
} = require("../services/comment.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class CommentController {
  createComment = async (req, res, next) => {
    // new
    new CREATED({
      message: "Create new comment success",
      metadata: await createComment(req.body),
    }).send(res);
  };

  getCommentsByProductId = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "Get comments by product ID success",
      metadata: await getCommentsByProductId(req.params),
    }).send(res);
  };

  getCommentByParentId = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "Get comments by parent ID success",
      metadata: await getCommentByParentId(req.query),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "Delete comment success",
      metadata: await deleteComment(req.params),
    }).send(res);
  };
}

module.exports = new CommentController();
