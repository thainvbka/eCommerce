const { model, Schema } = require("mongoose");
const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    key_accessToken: {
      type: String,
      required: true,
    },
    key_refreshToken: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      // luu nhung refresh token da su dung
      type: Array,
      default: [],
    },
    refreshToken: {
      // luu refresh token hien tai
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.KEY,
  }
);

module.exports = model(DOCUMENT_NAMES.KEY, keyTokenSchema);
