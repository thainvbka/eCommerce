"use strict";

const accessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    const result = await accessService.signUp(req.body);
    new CREATED({
      message: "User created successfully",
      metadata: result,
      options: {
        limit: 10, //vi du them options
      },
    }).send(res);
  };

  logIn = async (req, res, next) => {
    console.log(`[P]::logIn::`, req.body);
    const result = await accessService.logIn(req.body);
    new SuccessResponse({
      message: "User logged in successfully",
      metadata: result,
      options: {
        limit: 10, //vi du them options
      },
    }).send(res);
  };
}

module.exports = new AccessController();
