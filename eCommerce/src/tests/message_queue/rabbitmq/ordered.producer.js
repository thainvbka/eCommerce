"use strict";
const amqp = require("amqplib");

async function producerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:guest@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";
  await channel.assertQueue(queueName, {
    durable: true, //đảm bảo queue không bị mất khi RabbitMQ khởi động lại
  });

  for (let i = 0; i < 10; i++) {
    const message = `ordered-queued-message::${i}`;
    console.log(`message: ${message}`);
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true, //đảm bảo tin nhắn không bị mất khi RabbitMQ khởi động lại
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
}

producerOrderedMessage().catch((error) => console.error(error));
