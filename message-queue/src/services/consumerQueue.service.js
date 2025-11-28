"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../db/init.rabbit");

const messageQueueService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error starting consumer:", error);
      throw error;
    }
  },
};

module.exports = messageQueueService;
