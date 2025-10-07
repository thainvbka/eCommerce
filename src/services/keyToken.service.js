"use strict";
const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    key_accessToken,
    key_refreshToken,
    refreshToken,
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   key_accessToken,
      //   key_refreshToken,
      // });
      // if (!tokens) return null;
      // return tokens.key_accessToken;
      const filter = { user: userId },
        update = {
          key_accessToken,
          key_refreshToken,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.key_accessToken : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
