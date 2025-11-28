"use strict";
const messageQueueService = require("./src/services/consumerQueue.service");

const queueName = "test_queue";

messageQueueService
  .consumerToQueue(queueName)
  .then(() => {
    console.log(`Message consumer started: ${queueName}`);
  })
  .catch((err) => {
    console.error(`Message Error: ${err.message}`);
  });
