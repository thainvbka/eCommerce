"use strict";
const amqp = require("amqplib");

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (this.connection) {
      return { connection: this.connection, channel: this.channel };
    }

    try {
      this.connection = await amqp.connect("amqp://guest:guest@localhost:5672");
      this.channel = await this.connection.createChannel();

      console.log("RabbitMQ connected (Producer)");

      this.connection.on("close", () => {
        console.log("RabbitMQ connection closed.");
        this.connection = null;
        this.channel = null;
        setTimeout(() => this.connect(), 5000);
      });

      this.connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
      });

      return { connection: this.connection, channel: this.channel };
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      throw error;
    }
  }
}

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

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName}. To exit press CTRL+C`);
    channel.consume(
      queueName,
      (msg) => {
        if (msg !== null) {
          // Process the message
          // 1. find user follow shop
          // 2. push notification to user
          // 3. yes, ok =>> success
          // 4. error => setup DLX ( dead letter exchange )
          console.log("Received:", msg.content.toString());
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error in consumerQueue:", error);
    throw error;
  }
};

module.exports = { connectToRabbitMQ, testConnection, consumerQueue };
