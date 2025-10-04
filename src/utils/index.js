"use strict";

const _ = require("lodash");

// lay thong tin theo fields
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

module.exports = {
  getInfoData,
};
