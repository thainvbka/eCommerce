"use strict";

const { findByKey } = require("../services/apikey.service");
const keyTokenService = require("../services/keyToken.service");
const { NotFoundError, AuthFailureError } = require("../core/error.response");
const { HEADER } = require("../constants");
const jwt = require("jsonwebtoken");
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

const authenticate = async (req, res, next) => {
  /*
    1. Check userId  in headers
    2. Get keyStore with userId
    3. Verify accessToken
    4. Check userId === userId in accessToken
  */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await keyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decoded = await verifyJWT(refreshToken, keyStore.key_refreshToken);
      if (!decoded) throw new AuthFailureError("Invalid request");

      if (decoded.userId !== userId)
        throw new AuthFailureError("Invalid request");

      req.keyStore = keyStore;
      req.user = decoded;
      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decoded = await verifyJWT(accessToken, keyStore.key_accessToken);
    if (!decoded) throw new AuthFailureError("Invalid request");

    if (decoded.userId !== userId)
      throw new AuthFailureError("Invalid request");

    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
};

const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = {
  apiKey,
  permission,
  authenticate,
  verifyJWT,
};
