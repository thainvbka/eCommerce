"use strict";
const notification = require("../models/notification.model");
const { NOTIFICATION_TYPES, QUEUE_NAMES } = require("../constants");
const { sendToQueue } = require("./messageQueue.service");

async function pushNotificationToSystem({
  type = NOTIFICATION_TYPES.SHOP_NEW_PRODUCT,
  senderId,
  receiverId,
  options = {},
}) {
  let content = "";
  switch (type) {
    case NOTIFICATION_TYPES.ORDER_SUCCESS:
      content = "Your order has been placed successfully.";
      break;
    case NOTIFICATION_TYPES.ORDER_FAILED:
      content = "Your order placement has failed.";
      break;
    case NOTIFICATION_TYPES.PROMOTION_NEW:
      content = "A new promotion is available. Check it out!";
      break;
    case NOTIFICATION_TYPES.SHOP_NEW_PRODUCT:
      content = "A shop you follow has added a new product.";
      break;
    default:
      content = "You have a new notification.";
  }

  const payload = {
    noti_type: type,
    noti_content: content,
    noti_senderId: senderId,
    noti_receiverId: receiverId,
    noti_options: options,
    createdAt: new Date(),
  };

  await sendToQueue({
    queueName: QUEUE_NAMES.NOTIFICATION,
    message: payload,
  });

  // const newNotification = await notification.create({
  //   noti_type: type,
  //   noti_content: content,
  //   noti_senderId: senderId,
  //   noti_receiverId: receiverId,
  //   noti_options: options,
  // });

  return {
    success: true,
    message: "Notification queued for delivery",
    payload: payload,
  };
}

async function listNotificationsByUser({
  userId = 1,
  type = "ALL",
  isRead = 0,
}) {
  const match = { noti_receiverId: userId };

  if (type !== "ALL") {
    match["noti_type"] = type;
  }

  return await notification.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        noti_type: 1,
        noti_content: 1,
        noti_senderId: 1,
        noti_receiverId: 1,
        noti_options: 1,
        createdAt: 1,
      },
    },
  ]);
}

module.exports = {
  pushNotificationToSystem,
  listNotificationsByUser,
};
