"use strict";

const { findByKey } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    //check apiKey in headers
    const apiKey = req.headers[HEADER.API_KEY].toString();

    if (!apiKey) {
      return res.status(403).json({
        code: 403,
        message: "Forbidden",
      });
    }
    //check apiKey in db
    const objKey = await findByKey(apiKey);
    if (!objKey) {
      return res.status(403).json({
        code: 403,
        message: "Forbidden",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.error("Error apiKey middleware", error);
    return res.status(403).json({
      code: 403,
      message: "Forbidden",
    });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    try {
      const permissions = req.objKey.permissions || [];
      const check = permissions.includes(permission);
      if (!check) {
        console.log("Permission denied", permission, permissions);
        return res.status(403).json({
          code: 403,
          message: "permission denied",
        });
      }
      return next();
    } catch (error) {
      console.error("Error permission middleware", error);
      return res.status(403).json({
        code: 403,
        message: "Forbidden",
      });
    }
  };
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
