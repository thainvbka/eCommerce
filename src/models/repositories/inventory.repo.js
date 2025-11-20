"use strict";

const Inventory = require("../inventory.model");
const { convertToObjectId } = require("../../utils");

const insertInventory = async ({
  inven_productId,
  inven_location = "unknown",
  inven_stock,
  inven_shopId,
}) => {
  return await Inventory.create({
    inven_productId,
    inven_location,
    inven_stock,
    inven_shopId,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    update = {
      $inc: { inven_stock: -quantity },
      $push: {
        inven_reservations: { cartId, quantity, reservedAt: new Date() },
      },
    },
    options = { new: true, upsert: false }; // upsert: false để không tự tạo mới nếu thiếu hàng

  return await Inventory.findOneAndUpdate(query, update, options);
};

const releaseReservation = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectId(productId),
    },
    update = {
      $inc: { inven_stock: quantity },
      $pull: {
        inven_reservations: { cartId, quantity },
      },
    },
    options = { new: true };

  return await Inventory.updateOne(query, update, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
  releaseReservation,
};
