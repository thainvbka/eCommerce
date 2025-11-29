"use strict";
const amqp = require("amqplib");

async function consumerOrderedMessage() {
  const connection = await amqp.connect("amqp://guest:guest@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.prefetch(1); //đảm bảo mỗi consumer chỉ nhận một message tại một thời điểm => giữ thứ tự xử lý mặc dù xử lý không đồng bộ

  channel.consume(queueName, (msg) => {
    if (msg !== null) {
      //mô phỏng các order xử lý không đồng bộ, các message có thể được xử lý không theo thứ tự gửi
      setTimeout(() => {
        console.log(`Processed message: ${msg.content.toString()}`);
        channel.ack(msg);
      }, Math.random() * 1000);
    }
  });
}

consumerOrderedMessage().catch((error) => console.error(error));
