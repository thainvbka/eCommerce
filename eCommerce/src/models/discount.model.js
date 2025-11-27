const { model, Schema } = require("mongoose"); // Erase if already required

const { DOCUMENT_NAMES, COLLECTION_NAMES } = require("../constants");

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // percentage
    discount_value: { type: Number, required: true }, // 10.000 , 10
    discount_max_value: { type: Number }, // chỉ áp dụng cho percentage
    discount_code: { type: String, required: true }, // discountCode
    discount_start_date: { type: Date, required: true }, // ngày bắt đầu
    discount_end_date: { type: Date, required: true }, // ngày kết thúc
    discount_max_uses: { type: Number, required: true }, // số lượng discount được áp dụng
    discount_uses_count: { type: Number, required: true }, // số discount đã sử dụng
    discount_users_used: { type: Array, default: [] }, // ai đã dùng
    discount_max_uses_per_user: { type: Number, required: true }, // số lượng cho phép tối đa cho 1 user
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // sản phẩm được áp dụng
  },
  {
    timestamps: true,
    collection: COLLECTION_NAMES.DISCOUNT,
  }
);

module.exports = model(DOCUMENT_NAMES.DISCOUNT, discountSchema);
