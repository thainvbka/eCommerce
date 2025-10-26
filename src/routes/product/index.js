"use strict";

const express = require("express");
const router = express.Router();
const { authenticate } = require("../../auth/checkAuth");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");

router.get(
  "/search/:keySearch",
  asyncHandler(productController.searchProductsByUser)
);

router.use(authenticate);

router.post("", asyncHandler(productController.createProduct));

///query
router.get("/drafts/all", asyncHandler(productController.getDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getPublishesForShop)
);
//put
router.put(
  "/published/:id",
  asyncHandler(productController.publishProductByShop)
);
router.put(
  "/unpublished/:id",
  asyncHandler(productController.unPublishProductByShop)
);

module.exports = router;
