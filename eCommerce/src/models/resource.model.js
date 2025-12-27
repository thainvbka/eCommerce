"use strict";

const { model, Schema } = require("mongoose");

const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

//đinh nghia cac truong cho resource ma user co the truy cap
const resourceSchema = new Schema(
  {
    src_name: {
      type: String,
      required: true,
    },
    src_slug: {
      type: String,
      required: true,
    },
    src_description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.RESOURCE,
  }
);

module.exports = model(DOCUMENT_NAMES.RESOURCE, resourceSchema);
