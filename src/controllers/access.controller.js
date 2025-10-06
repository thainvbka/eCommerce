"use strict";

const accessService = require("../services/access.service");
const { CREATED } = require("../core/success.response");

class AccessController {
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    const result = await accessService.signUp(req.body);
    CREATED.send(res, {
      message: "User created successfully",
      metadata: result,
    });
  };
}

module.exports = new AccessController();
