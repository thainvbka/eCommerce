const { cart } = require("../models/cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCart = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
      cart_userId: userId,
      cart_state: "active",
      "cart_products.productId": productId,
    },
    updateOrInsert = {
      $set: {
        "cart_products.$.quantity": quantity,
      },
    },
    options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

module.exports = {
  createUserCart,
  updateUserCart,
};
