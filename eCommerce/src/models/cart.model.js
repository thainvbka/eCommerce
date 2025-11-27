const { model, Schema } = require("mongoose"); // Erase if already required

const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: { type: Array, required: true, default: [] },
    /*
    [
      {
        productId,
        shopId,
        quantity,
        name,
        price
      }
    ]
  */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true }, //chua co user model nen de la number
  },
  {
    collection: COLLECTION_NAMES.CART,
    timeseries: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = {
  cart: model(DOCUMENT_NAMES.CART, cartSchema),
};
