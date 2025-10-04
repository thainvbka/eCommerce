"use strict";

const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    //verify token
    const verifyAccess = await jwt.verify(
      accessToken,
      publicKey,
      (err, decode) => {
        if (err) {
          console.error("Error verify access token", err);
        }
        console.log("Decode access token", decode);
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating token pair", error);
  }
};

module.exports = { createTokenPair };
