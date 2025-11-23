"use strict";
const { listNotificationsByUser } = require("../services/notification.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class NotificationController {
  listNotificationsByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "List notifications by user ID success",
      metadata: await listNotificationsByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
