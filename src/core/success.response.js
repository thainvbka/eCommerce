"use strict";
const StatusCodes = require("../configs/statusCodes");
const ReasonPhrases = require("../configs/reasonPhrases");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatus = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatus : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
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
