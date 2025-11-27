"use strict";

const DiscountService = require("../services/discount.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    const result = await DiscountService.createDiscountCode({
      ...req.body,
      shopId: req.user.userId,
    });
    new SuccessResponse({
      message: "Discount created successfully",
      metadata: result,
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodesByShop({
      shopId: req.user.userId,
      ...req.query,
    });
    new SuccessResponse({
      message: "Get all discount codes successfully",
      metadata: result,
    }).send(res);
  };

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodeWithProducts({
      ...req.query,
    });
    new SuccessResponse({
      message: "Get discount code with products successfully",
      metadata: result,
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    const result = await DiscountService.getDiscountAmount({
      ...req.body,
      shopId: req.user.userId,
    });
    new SuccessResponse({
      message: "Get discount amount successfully",
      metadata: result,
    }).send(res);
  };
}

module.exports = new DiscountController();
