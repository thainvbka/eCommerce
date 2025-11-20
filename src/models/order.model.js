"use strict";

const { model, Schema } = require("mongoose");
const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
      order_checkout = {
        totalPrice,
        totalApplyDiscount,
        feeShip
      }
    */
    order_shipping: { type: Object, default: {} },
    /*
      street,
      city,
      state,
      country
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: "#0000118052022" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAMES.ORDER,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = model(DOCUMENT_NAMES.ORDER, orderSchema);
