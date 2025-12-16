"use strict";
const {
  consumerToQueue,
  consumerToQueueFailed,
  consumerToQueueNomar,
} = require("./src/services/consumerQueue.service");

//init db
const db = require("./src/db/init.mongodb");

// const queueName = "test_queue";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log(`Message consumer started: ${queueName}`);
//   })
//   .catch((err) => {
//     console.error(`Message Error: ${err.message}`);
//   });

consumerToQueueNomar()
  .then(() => {
    console.log(`Message consumerToQueueNomar started`);
  })
  .catch((err) => {
    console.error(`Message Error: ${err.message}`);
  });

consumerToQueueFailed()
  .then(() => {
    console.log(`Message consumerToQueueFailed started`);
  })
  .catch((err) => {
    console.error(`Message Error: ${err.message}`);
  });
