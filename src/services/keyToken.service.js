"use strict";
const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      if (!tokens) return null;
      return tokens.publicKey;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
