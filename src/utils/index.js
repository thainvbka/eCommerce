"use strict";

const _ = require("lodash");
const crypto = require("crypto");

// lay thong tin theo fields
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const generateRandomBytes = (size) => {
  return crypto.randomBytes(size).toString("hex");
};

module.exports = {
  getInfoData,
  generateRandomBytes,
};
