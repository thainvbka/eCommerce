const { cart } = require("../models/cart.model");
const { convertToObjectId } = require("../../utils");

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
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    },
    options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const deleteProductInCart = async ({ userId, productId }) => {
  const query = { cart_userId: userId, cart_state: "active" },
    update = {
      $pull: {
        cart_products: { productId: productId },
      },
    },
    options = { new: true };

  return await cart.findOneAndUpdate(query, update, options);
};

const findCartById = async (cartId) => {
  return await cart
    .findOne({ _id: convertToObjectId(cartId), cart_state: "active" })
    .lean();
};

module.exports = {
  createUserCart,
  updateUserCart,
  deleteProductInCart,
  findCartById,
};
