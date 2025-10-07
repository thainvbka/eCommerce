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

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken });
  };
}
module.exports = KeyTokenService;
