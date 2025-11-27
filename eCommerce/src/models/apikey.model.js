"use strict";

const { model, Schema } = require("mongoose");
const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.API_KEY,
  }
);

module.exports = model(DOCUMENT_NAMES.API_KEY, apiKeySchema);
