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
  deleteProductInCart,
} = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");

const { getProductById } = require("../models/repositories/product.repo");

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

  //update khi dang o trong gio hang
  /**
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
              productId,
              quantity,
              price,
              shopId,
              old_quantity
          }
        ],
        version
      }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    //check product exist
    const product = await getProductById(productId);
    if (!product) throw new Error("Product not found");

    if (product.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      //remove product from cart
      return await deleteProductInCart({ userId, productId });
    }

    return await updateUserCart({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static deleteItemUserCart = async ({ userId, productId }) => {
    return await deleteProductInCart({ userId, productId });
  };

  static getUserCart = async ({ userId }) => {
    const userCart = await cart.findOne({
      cart_userId: userId,
      cart_state: "active",
    });
    return userCart;
  };
}

module.exports = CartService;
