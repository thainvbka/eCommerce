"use strict";

const DOCUMENT_NAMES = {
  SHOP: "Shop",
  API_KEY: "Apikey",
  KEY: "Key",
  INVENTORY: "Inventory",
  DISCOUNT: "Discount",
  PRODUCT: "Product",
  CART: "Cart",
  ORDER: "Order",
  COMMENT: "Comment",
  NOTIFICATION: "Notification",
  USER: "User",
  RESOURCE: "Resource",
  ROLE: "Role",
};

const COLLECTION_NAMES = {
  SHOP: "Shops",
  API_KEY: "Apikeys",
  KEY: "Keys",
  INVENTORY: "Inventories",
  DISCOUNT: "Discounts",
  PRODUCT: "Products",
  CART: "Carts",
  ORDER: "Orders",
  COMMENT: "Comments",
  NOTIFICATION: "Notifications",
  USER: "Users",
  RESOURCE: "Resources",
  ROLE: "Roles",
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

const NOTIFICATION_TYPES = {
  ORDER_SUCCESS: "ORDER_001",
  ORDER_FAILED: "ORDER_002",
  PROMOTION_NEW: "PROMOTION_001",
  SHOP_NEW_PRODUCT: "SHOP_001",
};

const QUEUE_NAMES = {
  ORDER: "orderQueue",
  NOTIFICATION: "notificationQueue",
  EMAIL: "emailQueue",
  SMS: "smsQueue",
  INVENTORY_SYNC: "inventorySyncQueue",
};

module.exports = {
  DOCUMENT_NAMES,
  COLLECTION_NAMES,
  ROLES,
  HEADER,
  NOTIFICATION_TYPES,
  QUEUE_NAMES,
};
