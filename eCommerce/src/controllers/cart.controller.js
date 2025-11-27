"use strict";

const CartService = require("../services/cart.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class CartController {
  addToCart = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "Create new Cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  // update + -
  update = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "Create new Cart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteItem = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "deleted Cart success",
      metadata: await CartService.deleteItemUserCart(req.body),
    }).send(res);
  };

  listToCart = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "List Cart success",
      metadata: await CartService.getUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
