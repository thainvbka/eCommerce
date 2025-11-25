const amqp = require("amqplib");
const message = "hello RabbitMQ Nguyen Van Thai";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const queueName = "test_queue";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("Message sent to RabbitMQ:", message);

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error in RabbitMQ producer:", error);
  }
};

runProducer().catch((error) => console.error(error));
