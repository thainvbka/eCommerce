"use strict";

const { convertToObjectId } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
  createNewDiscount,
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("./product.service");
const discount = require("../models/discount.model");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      name,
      description,
      type,
      value,
      max_value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      is_active,
      shopId,
      applies_to,
      product_ids,
    } = payload;

    //kiem tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code is not valid at this time");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId),
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await createNewDiscount({
      code,
      start_date,
      end_date,
      is_active,
      shopId: convertToObjectId(shopId),
      min_order_value,
      product_ids: product_ids.map((id) => convertToObjectId(id)),
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      users_used,
      max_uses,
      uses_count,
      max_uses_per_user,
    });

    return newDiscount;
  }

  //lay tat ca discount code co san va san pham ap dung
  static async getAllDiscountCodeWithProducts({
    discount_code,
    shopId,
    page,
    limit,
  }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: discount_code,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;

    // If applies to all products, return all products (pagination can be applied here)
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: { product_shop: convertToObjectId(shopId), isPublished: true },
        sort: "ctime",
        select: [
          "product_name",
          "product_price",
          "product_thumb",
          "product_description",
        ],
      });
      return products;
    } else {
      // If applies to specific products, return those products
      products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        sort: "ctime",
        select: [
          "product_name",
          "product_price",
          "product_thumb",
          "product_description",
        ],
      });
      return products;
    }
  }

  // lay tat ca discount code cua shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discountCodes = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      sort: "ctime",
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v"],
      model: discount,
    });

    return discountCodes;
  }

  static async getDiscountAmount({ discount_code, products, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }

    const {
      discount_type,
      discount_max_uses,
      discount_users_used,
      discount_max_uses_per_user,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_value,
    } = foundDiscount;

    console.log({ discount_value });

    if (!discount_max_uses) {
      throw new BadRequestError("Discount code has reached its maximum uses");
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code is not valid at this time");
    }

    // Calculate the discount amount based on the products
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Order total must be at least ${discount_min_order_value} to use this discount code`
        );
      }
    }

    //check max uses per user
    if (discount_max_uses_per_user > 0) {
      const userUsesCount = discount_users_used.find(
        (user) => user.userId === userId
      );
      //moi user chi dc su dung 1 lan
      if (userUsesCount) {
        // Neu user da su dung discount code roi
        throw new BadRequestError("You have already used this discount code");
      }
    }

    //kiem tra type discount de tinh toan
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : discount_value * totalOrder * 0.01;
    console.log({ amount });
    return {
      totalOrder,
      amount,
      totalPrice: totalOrder - amount,
    };
  }

  //xoa discount code
  static async deleteDiscountCode({ discount_code, shopId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: discount_code,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }
    const deleted = await discount.findOneAndDelete({
      discount_code: discount_code,
      discount_shopId: convertToObjectId(shopId),
    });

    return deleted;
  }

  //cancel discount code by user
  static async cancelDiscountByUser({ discount_code, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: discount_code,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }

    // Remove user from discount_users_used array
    const updatedDiscount = await discount.findOneAndUpdate(
      {
        discount_code: discount_code,
        discount_shopId: convertToObjectId(shopId),
      },
      {
        $pull: { discount_users_used: { userId: userId } },
        $inc: { discount_uses_count: -1, discount_max_uses: 1 },
      },
      { new: true }
    );

    return updatedDiscount;
  }
}

module.exports = DiscountService;
