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

  static updateKeyToken = async ({
    id,
    newKeyAccess,
    newKeyRefresh,
    newRefreshToken,
    oldRefreshToken,
  }) => {
    return await keyTokenModel.findByIdAndUpdate(
      id,
      {
        key_accessToken: newKeyAccess,
        key_refreshToken: newKeyRefresh,
        $push: { refreshTokensUsed: oldRefreshToken },
        refreshToken: newRefreshToken,
      },
      {
        new: true,
      }
    );
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

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}
module.exports = KeyTokenService;
