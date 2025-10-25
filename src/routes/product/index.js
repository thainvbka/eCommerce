"use strict";

const express = require("express");
const router = express.Router();
const { authenticate } = require("../../auth/checkAuth");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

router.use(authenticate);

router.post("", asyncHandler(productController.createProduct));

module.exports = router;
