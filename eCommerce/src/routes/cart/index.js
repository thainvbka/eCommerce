"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");

const { authenticate } = require("../../auth/checkAuth");

router.use(authenticate);

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteItem));
router.post("/update", asyncHandler(cartController.update));
router.get("", asyncHandler(cartController.listToCart));

module.exports = router;
