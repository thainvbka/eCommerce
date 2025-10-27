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

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((field) => [field, 1]));
};

const getUnselectData = (unselect = []) => {
  return Object.fromEntries(unselect.map((field) => [field, 0]));
};

module.exports = {
  getInfoData,
  generateRandomBytes,
  getSelectData,
  getUnselectData,
};
