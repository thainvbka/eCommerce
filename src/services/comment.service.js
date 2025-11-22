"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils/index");

/**
 * key features:
 * - create comment
 * - get all comments by productId
 * - get list comments by productId
 * - delete comment (soft delete)
 *
 */
class CommentService {
  static async createComment({
    productId,
    content,
    parentCommentId = null,
    userId,
  }) {
    let rightValue;

    if (parentCommentId) {
      //rely comment
      const parent = await comment
        .findOne({ _id: convertToObjectId(parentCommentId) })
        .select("comment_right");
      if (!parent) {
        throw new NotFoundError("Parent comment not found");
      }
      rightValue = parent.comment_right;
      //cap nhat lai left va right cua cac comment khac
      await comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        { $inc: { comment_right: 2 } }
      );
      await comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        { $inc: { comment_left: 2 } }
      );
    } else {
      const maxRightComment = await comment
        .findOne({ comment_productId: convertToObjectId(productId) })
        .select("comment_right")
        .sort({ comment_right: -1 })
        .exec();

      //lay max right comment
      if (maxRightComment) {
        //neu co comment thi lay right + 1
        rightValue = maxRightComment.comment_right + 1;
      } else {
        //neu chua co comment nao thi right = 1
        rightValue = 1;
      }
    }

    const newComment = await comment.create({
      comment_productId: productId,
      comment_content: content,
      comment_parentId: parentCommentId,
      comment_userId: userId,
      comment_left: rightValue,
      comment_right: rightValue + 1,
    });

    return newComment;
  }
  static async getCommentsByProductId({ productId }) {
    const comments = await comment
      .find({ comment_productId: convertToObjectId(productId) })
      .select("-__v -isDeleted -comment_right -comment_left")
      .sort({ comment_left: 1 })
      .exec();

    if (!comments) {
      throw new BadRequestError("Comments not found");
    }
    return comments;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await comment.findById(convertToObjectId(parentCommentId));
      if (!parent) {
        throw new BadRequestError("Parent comment not found");
      }
      const comments = await comment
        .find({
          comment_productId: convertToObjectId(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        })
        .limit(limit)
        .skip(offset);
      return comments;
    }

    // Lấy comment gốc (Root)
    const comments = await comment
      .find({
        comment_productId: convertToObjectId(productId),
        comment_parentId: null,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      })
      .limit(limit)
      .skip(offset);

    return comments;
  }

  static async deleteComment({ commentId }) {
    const deletedComment = await comment.findByIdAndUpdate(
      convertToObjectId(commentId),
      { isDelete: true },
      { new: true }
    );

    await comment.updateMany(
      {
        comment_left: { $gt: deletedComment.comment_left },
        comment_right: { $lt: deletedComment.comment_right },
      },
      { isDelete: true }
    );

    const width =
      deletedComment.comment_right - deletedComment.comment_left + 1;

    // Cập nhật lại left và right của các comment còn lại
    await comment.updateMany(
      { comment_left: { $gt: deletedComment.comment_right } },
      { $inc: { comment_left: -width } }
    );

    await comment.updateMany(
      { comment_right: { $gt: deletedComment.comment_right } },
      { $inc: { comment_right: -width } }
    );

    if (!deletedComment) {
      throw new NotFoundError("Comment not found");
    }
  }
}

module.exports = CommentService;
