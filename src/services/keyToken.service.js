"use strict";
const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    key_accessToken,
    key_refreshToken,
  }) => {
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        key_accessToken,
        key_refreshToken,
      });
      if (!tokens) return null;
      return tokens.key_accessToken;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
