("use strict");
const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

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
    const userCart = await findCartById(cartId);
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
          codeId: shop_discounts[0].codeId,
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

        //tong thanh toan cuoi cung
        checkout_orders.totalCheckout += itemCheckout.priceApplyDiscount;
        shop_orders_ids_new.push(itemCheckout);
      }
    }

    return {
      shop_order_ids,
      shop_orders_ids_new,
      checkout_orders,
    };
  }
}

module.exports = CheckoutService;
