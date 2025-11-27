const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");
const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
  {
    comment_userId: {
      type: Number,
      default: 1,
    },
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment_content: { type: String, default: "text" },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAMES.COMMENT,
    },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.COMMENT,
  }
);

module.exports = model(DOCUMENT_NAMES.COMMENT, commentSchema);
