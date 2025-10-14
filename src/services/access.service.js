"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const createTokenPair = require("../auth/authUtils").createTokenPair;
const { getInfoData } = require("../utils");
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { ROLES } = require("../constants");
const { findByEmail } = require("./shop.service");
const { generateRandomBytes } = require("../utils");
const { verifyJWT } = require("../auth/checkAuth");

class AccessService {
  static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      console.log("Possible token reuse detected!");
      //xoa token cu
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong! Please login again");
    }

    if (keyStore.refreshToken !== refreshToken) {
      console.log("Token mismatch detected!");
      throw new AuthFailureError("Shop not registered");
    }

    //check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    //create new tokens
    // const key_accessToken = generateRandomBytes(64);
    // const key_refreshToken = generateRandomBytes(64);

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.key_accessToken,
      keyStore.key_refreshToken
    );

    //update token
    await KeyTokenService.updateKeyToken({
      id: keyStore._id,
      newRefreshToken: tokens.refreshToken,
      oldRefreshToken: refreshToken,
    });

    return {
      user,
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new ConflictRequestError("Error: Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [ROLES.SHOP],
    });

    if (newShop) {
      //create private key and public key
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const key_accessToken = generateRandomBytes(64);
      const key_refreshToken = generateRandomBytes(64);

      const tokenStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        key_accessToken,
        key_refreshToken,
      });

      if (!tokenStore) {
        throw new BadRequestError("Error: KeyToken not found");
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      //create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        key_accessToken,
        key_refreshToken
      );

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }

    return {};
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: error,
    //   };
    // }
  };

  static logIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Email or Password incorrect");
    }

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Error: Email or Password incorrect");
    }

    const key_accessToken = generateRandomBytes(64);
    const key_refreshToken = generateRandomBytes(64);

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      key_accessToken,
      key_refreshToken
    );

    const tokenStore = await KeyTokenService.createKeyToken({
      userId,
      key_accessToken,
      key_refreshToken,
      refreshToken: tokens.refreshToken,
    });

    if (!tokenStore) {
      throw new BadRequestError("Error: KeyToken not found");
    }

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logOut = async ({ keyStore }) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };
}

module.exports = AccessService;
