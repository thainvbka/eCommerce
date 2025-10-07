"use strict";

const DOCUMENT_NAMES = {
  SHOP: "Shop",
  API_KEY: "Apikey",
  KEY: "Key",
};

const COLLECTION_NAMES = {
  SHOP: "Shops",
  API_KEY: "Apikeys",
  KEY: "Keys",
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
};

module.exports = {
  DOCUMENT_NAMES,
  COLLECTION_NAMES,
  ROLES,
  HEADER,
};
