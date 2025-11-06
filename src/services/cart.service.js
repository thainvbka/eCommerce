/**
 * Cart Service
 - add product to cart (user)
 - reduce product quantity by one (user)
 - increase product quantity by one (user)
 - get cart (user)
 - delete cart (user)
 - delete cart item (user)
 */
const { cart } = require("../models/cart.model");
const {
  createUserCart,
  updateUserCart,
} = require("../models/repositories/cart.repo");

class CartService {
  static async addToCart({ userId, product }) {
    //check cart exist
    const userCart = await cart.findOne({
      cart_userId: userId,
      cart_state: "active",
    });
    if (!userCart) {
      return await createUserCart({ userId, product });
    }

    //neu co gio hang roi nhung chua co san pham do trong gio hang
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    //neu co san pham trong gio hang roi
    return await updateUserCart({ userId, product });
  }
}
