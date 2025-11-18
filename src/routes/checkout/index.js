"use strict";

const express = require("express");
const CheckoutController = require("../../controllers/checkout.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");

router.post("/review", asyncHandler(CheckoutController.checkoutReview));

module.exports = router;
