"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../db/init.rabbit");
const { QUEUE_NAMES } = require("../constants");
const notification = require("../models/notification.model");

const messageQueueService = {
  //nhan message tu queue
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error starting consumer:", error);
      throw error;
    }
  },

  //consumer notification queue
  //case processing: nhan message binh thuong
  consumerToQueueNomar: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiQueue = QUEUE_NAMES.NOTIFICATION;

      await channel.assertQueue(notiQueue, {
        durable: true,
        deadLetterExchange: "notificationExDLX",
        deadLetterRoutingKey: "notificationRoutingKeyDLX",
      });
      channel.prefetch(1); // Chi lay 1 message moi lan

      //1. xử lí lỗi TTL cho message
      // setTimeout(async () => {
      //   channel.consume(notiQueue, (msg) => {
      //     if (msg !== null) {
      //       // Process the message
      //       console.log(
      //         "Received in normal processing:",
      //         msg.content.toString()
      //       );
      //       channel.ack(msg);
      //     }
      //   });
      // }, 15000);

      // xử lí lỗi logic
      channel.consume(notiQueue, async (msg) => {
        try {
          const data = JSON.parse(msg.content.toString());

          await notification.create(data);
          console.log("Notification saved:", data);

          channel.ack(msg);
        } catch (error) {
          console.error("Send notification error:", error);
          channel.nack(msg, false, false); // Gửi message đến DLX
          /*
          msg: tin nhan bi loi
          false: từ chỗi duy nhất tin nhắn hiện tại
          false: không gửi lại tin nhắn về queue gốc
          */
        }
      });
    } catch (error) {
      console.error("Error starting normal consumer:", error);
      throw error;
    }
  },
  //case faild processing (setup DLX) : nhan message bi loi
  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationExchangeDLX = "notificationExDLX";
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";
      const notiQueueHandle = "notificationQueueHotFix";

      //1. create exchange DLX
      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });
      //2. create queue to handle message from DLX
      const queueResult = await channel.assertQueue(notiQueueHandle, {
        // exclusive: false, //cho phep nhieu consumer cung truy cap
        durable: true,
      });
      //3. bind queue to exchange DLX
      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );
      //4. consume message from DLX
      channel.consume(
        queueResult.queue,
        (msg) => {
          if (msg !== null) {
            // Process the failed message
            console.log(
              "Received in failed processing (DLX):",
              msg.content.toString()
            );
          }
          channel.ack(msg);
        },
        {
          noAck: false,
        }
      );
    } catch (error) {
      console.error("Error starting failed consumer:", error);
      throw error;
    }
  },
};

module.exports = messageQueueService;
