const { BadRequestError } = require("../core/error.response");
const { getChannel } = require("../db/init.rabbit");

const sendToQueue = async ({ queueName, message, options = {} }) => {
  try {
    //1. lay channel
    const channel = await getChannel();

    //2. assert queue (create if not exists)
    await channel.assertQueue(queueName, {
      durable: true, // dam bao queue khong bi mat khi RabbitMQ khoi dong lai
      deadLetterExchange: "notificationExDLX",
      deadLetterRoutingKey: "notificationRoutingKeyDLX",
      ...options,
    });

    //3. gui tin nhan den queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true, // dam bao tin nhan khong bi mat khi RabbitMQ khoi dong lai
    });
    console.log(`Message sent to queue ${queueName}:`, message);
  } catch (error) {
    console.error("Error sending message to queue:", error);
    throw new BadRequestError("Cannot send message to queue");
  }
};

module.exports = {
  sendToQueue,
};
