("use strict");
const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { convertToObjectId } = require("../utils");
const { acquireLock, releaseLock } = require("./redis.service");
const { deleteProductInCart } = require("../models/repositories/cart.repo");
const {
  reservationInventory,
  releaseReservation,
} = require("../models/repositories/inventory.repo");
const orderModel = require("../models/order.model");

class CheckoutService {
  /*
{
  cartId,
  userId,
  shop_order_ids: [
    {
      shopId,
      shop_discounts: [],
      item_products: [
        {
          price,
          quantity,
          productId
        }
      ]
    },
    {
      shopId,
      shop_discounts: [
        {
          shopId,
          discountId,
          codeId
        }
      ],
      item_products: [
        {
          price,
          quantity,
          productId
        }
      ]
    }
  ]
}
*/
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //check cart exist
    const userCart = await findCartById(convertToObjectId(cartId));
    if (!userCart || userCart.cart_userId.toString() !== userId) {
      throw new NotFoundError("Cart not found");
    }

    const checkout_orders = {
        totalPrice: 0, //tổng tiền hàng
        feeShip: 0, //phí ship
        totalDiscount: 0, //tổng giảm giá
        totalCheckout: 0, //tổng tiền thanh toán
      },
      shop_orders_ids_new = [];

    //tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      //check product available
      const checkProductServer = await checkProductByServer(item_products);
      console.log("checkProductServer::", checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError("order wrong!!!");

      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truowc khi xu ly
      checkout_orders.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tine truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // neu shop_discounts ton tai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co mot discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          discount_code: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        // tong cong discount giam gia
        checkout_orders.totalDiscount += discount;

        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      //tong thanh toan cuoi cung
      checkout_orders.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_orders_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_orders_ids_new,
      checkout_orders,
    };
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_orders } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    //check lại mot lan xem vuot tong kho hang khong
    //get new array products to check inventory
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]::products::`, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { quantity, productId } = products[i];
      const keyLock = await acquireLock(productId, cartId);
      console.log("keyLock::", keyLock);
      if (keyLock) {
        try {
          const checkInventory = await reservationInventory({
            productId,
            quantity,
            cartId,
          });
          // Nếu trừ kho thành công (có trả về document)
          if (checkInventory) {
            acquireProduct.push(productId);
          } else {
            // Nếu kho không đủ hàng, rollback các sản phẩm đã đặt trước đó
            for (const id of acquireProduct) {
              const p = products.find((p) => p.productId === id);
              if (p) {
                await releaseReservation({
                  productId: p.productId,
                  quantity: p.quantity,
                  cartId,
                });
              }
            }
            throw new BadRequestError("Một số sản phẩm đã hết hàng");
          }
        } catch (error) {
          // Rollback nếu có lỗi xảy ra
          for (const id of acquireProduct) {
            const p = products.find((p) => p.productId === id);
            if (p) {
              await releaseReservation({
                productId: p.productId,
                quantity: p.quantity,
                cartId,
              });
            }
          }
          throw error;
        } finally {
          await releaseLock(keyLock);
        }
      } else {
        // Nếu không lấy được lock, rollback và báo lỗi
        for (const id of acquireProduct) {
          const p = products.find((p) => p.productId === id);
          if (p) {
            await releaseReservation({
              productId: p.productId,
              quantity: p.quantity,
              cartId,
            });
          }
        }
        throw new BadRequestError("Vui lòng quay lại giỏ hàng (Lock failed)");
      }
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_orders,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // truong hop: new insert thanh cong, thi remove product co trong cart
    if (newOrder) {
      // remove product in my cart
      for (let i = 0; i < products.length; i++) {
        const { productId } = products[i];
        await deleteProductInCart({ userId, productId });
      }
    }
    return newOrder;
  }
}

module.exports = CheckoutService;
