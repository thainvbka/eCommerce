"use strict";

const { model, Schema } = require("mongoose");
const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unknown",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.INVENTORY,
  }
);

module.exports = model(DOCUMENT_NAMES.INVENTORY, inventorySchema);
