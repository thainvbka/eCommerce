"use strict";

const DOCUMENT_NAMES = {
  SHOP: "Shop",
  API_KEY: "Apikey",
  KEY: "Key",
  INVENTORY: "Inventory",
  DISCOUNT: "Discount",
  PRODUCT: "Product",
  CART: "Cart",
};

const COLLECTION_NAMES = {
  SHOP: "Shops",
  API_KEY: "Apikeys",
  KEY: "Keys",
  INVENTORY: "Inventories",
  DISCOUNT: "Discounts",
  PRODUCT: "Products",
  CART: "Carts",
};

const ROLES = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "x-rtoken-id",
};

module.exports = {
  DOCUMENT_NAMES,
  COLLECTION_NAMES,
  ROLES,
  HEADER,
};
