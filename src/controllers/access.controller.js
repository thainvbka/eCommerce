"use strict";

const accessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    console.log(`[P]::signUp::`, req.body);
    const result = await accessService.signUp(req.body);
    res.status(201).json(result);
  };
}

module.exports = new AccessController();
