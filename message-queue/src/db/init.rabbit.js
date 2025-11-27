"use strict";
const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
    if (!connection) {
      throw new Error("Failed to connect to RabbitMQ");
    }
    const channel = await connection.createChannel();
    if (!channel) {
      throw new Error("Failed to create channel");
    }
    return { connection, channel };
  } catch (error) {}
};

const testConnection = async () => {
  try {
    const { connection, channel } = await connectToRabbitMQ();

    //publish message to test queue
    const queue = "message_queue_test";
    await channel.assertQueue(queue, { durable: false });

    const message = "Hello, RabbitMQ!";
    channel.sendToQueue(queue, Buffer.from(message));
    console.log("Sent message to test_queue:", message);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

module.exports = { connectToRabbitMQ, testConnection };
