const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
