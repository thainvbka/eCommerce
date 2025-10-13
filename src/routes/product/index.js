"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

router.post("", asyncHandler(productController.createProduct));

module.exports = router;
