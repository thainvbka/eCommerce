"use strict";
const amqp = require("amqplib");

// Singleton pattern - chỉ tạo 1 connection duy nhất
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

      // Xử lý khi connection bị đóng
      this.connection.on("close", () => {
        console.log("RabbitMQ connection closed.");
        this.connection = null;
        this.channel = null;
        setTimeout(() => this.connect(), 5000); // Retry sau 5s
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

  async getChannel() {
    if (!this.channel) {
      await this.connect();
    }
    return this.channel;
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    console.log("RabbitMQ connection closed");
  }
}

// Export singleton instance
const rabbitMQConnection = new RabbitMQConnection();

module.exports = {
  connectToRabbitMQ: () => rabbitMQConnection.connect(),
  getChannel: () => rabbitMQConnection.getChannel(),
  closeRabbitMQConnection: () => rabbitMQConnection.close(),
};
