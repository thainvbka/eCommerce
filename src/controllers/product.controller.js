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

  getDraftsForShop = async (req, res, next) => {
    const result = await ProductFactory.findAllDraftsForShop({
      product_shop: req.user.userId,
    });
    new SuccessResponse({
      message: "Get drafts for shop successfully",
      metadata: result,
    }).send(res);
  };

  getPublishesForShop = async (req, res, next) => {
    const result = await ProductFactory.findAllPublishedForShop({
      product_shop: req.user.userId,
    });
    new SuccessResponse({
      message: "Get published for shop successfully",
      metadata: result,
    }).send(res);
  };

  searchProductsByUser = async (req, res, next) => {
    const keySearch = req.params.keySearch;
    const result = await ProductFactory.searchProductsByUser({ keySearch });
    new SuccessResponse({
      message: "Search products successfully",
      metadata: result,
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    const product_id = req.params.id;
    const result = await ProductFactory.publishProductByShop({
      product_shop: req.user.userId,
      product_id,
    });
    new SuccessResponse({
      message: "Publish product for shop successfully",
      metadata: result,
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    const product_id = req.params.id;
    const result = await ProductFactory.unPublishProductByShop({
      product_shop: req.user.userId,
      product_id,
    });
    new SuccessResponse({
      message: "Unpublish product for shop successfully",
      metadata: result,
    }).send(res);
  };
}

module.exports = new ProductController();
