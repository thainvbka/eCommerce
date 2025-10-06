"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const createTokenPair = require("../auth/authUtils").createTokenPair;
const crypto = require("crypto");
const { getInfoData } = require("../utils");
const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");

const ROLES = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
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

      const key_accessToken = crypto.randomBytes(64).toString("hex");
      const key_refreshToken = crypto.randomBytes(64).toString("hex");

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
}

module.exports = AccessService;
