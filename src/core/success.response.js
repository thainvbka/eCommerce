"use strict";
const { StatusCodes, ReasonPhrases } = require("../configs/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatus = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatus : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  static send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      metadata,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatus = ReasonPhrases.CREATED,
    metadata,
  }) {
    super({
      message,
      statusCode,
      reasonStatus,
      metadata,
    });
  }
}

module.exports = {
  OK,
  CREATED,
};
