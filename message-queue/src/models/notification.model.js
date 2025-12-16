const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");
const { model, Schema } = require("mongoose");

//ORDER_001: order successfully
//ORDER_002: order failed
//PROMOTION_001: new promotion
//SHOP_001: new product from shop you follow
const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      required: true,
      enum: ["ORDER_001", "ORDER_002", "PROMOTION_001", "SHOP_001"],
    },
    noti_content: { type: String, required: true },
    noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: "Shop" },
    noti_receiverId: { type: Number, required: true }, //user id
    noti_options: { type: Object, default: {} }, //additional info
  },
  {
    collection: COLLECTION_NAMES.NOTIFICATION,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAMES.NOTIFICATION, notificationSchema);
