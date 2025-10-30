"use strict";

const { inventory } = require("../models/inventory.model");

const insertInventory = async ({
  inven_productId,
  inven_location = "unknown",
  inven_stock,
  inven_shopId,
}) => {
  return await inventory.create({
    inven_productId,
    inven_location,
    inven_stock,
    inven_shopId,
  });
};

module.exports = {
  insertInventory,
};
