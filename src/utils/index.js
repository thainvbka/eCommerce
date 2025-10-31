"use strict";

const _ = require("lodash");
const crypto = require("crypto");
const { Types } = require("mongoose");

const convertToObjectId = (id) => new Types.ObjectId(id);

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

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObject = (obj) => {
  // console.log("obj", obj); // Tạm ẩn log để dễ nhìn
  const final = {};

  // Thêm kiểm tra obj có phải là object hợp lệ không (phòng trường hợp gọi với null)
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return obj;
  }

  Object.keys(obj).forEach((key) => {
    // Sửa điều kiện IF tại đây:
    if (
      typeof obj[key] === "object" && // Là object
      obj[key] !== null && // Không phải null
      !Array.isArray(obj[key]) && // Không phải mảng
      Object.keys(obj[key]).length > 0 // VÀ có chứa key bên trong
    ) {
      // Nếu là object lồng nhau và không rỗng, tiếp tục đệ quy
      const nested = updateNestedObject(obj[key]);

      Object.keys(nested).forEach((nestedKey) => {
        final[`${key}.${nestedKey}`] = nested[nestedKey];
      });
    } else {
      // Nếu là giá trị (number, string, boolean, array, null, hoặc object rỗng)
      final[key] = obj[key];
    }
  });

  // console.log("final", final);
  return final;
};

module.exports = {
  getInfoData,
  generateRandomBytes,
  getSelectData,
  getUnselectData,
  removeUndefinedObject,
  updateNestedObject,
  convertToObjectId,
};
