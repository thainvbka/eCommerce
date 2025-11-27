"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");

const { authenticate } = require("../../auth/checkAuth");

// get amount a discount
router.get(
  "/list_product_code",
  asyncHandler(discountController.getAllDiscountCodesWithProducts)
);

// authentication
router.use(authenticate);

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
