"use strict";

const ProductFactory = require("../services/product.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    const result = await ProductFactory.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId,
    });
    new SuccessResponse({
      message: "Product created successfully",
      metadata: result,
    }).send(res);
  };
}

module.exports = new ProductController();
