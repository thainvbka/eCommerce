const amqp = require("amqplib");
const message = "hello RabbitMQ Nguyen Van Thai";

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const queueName = "test_queue";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.consume(queueName, (message) => {
      if (message !== null) {
        console.log(
          "Message received from RabbitMQ:",
          message.content.toString()
        );
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Error in RabbitMQ consumer:", error);
  }
};

runConsumer().catch((error) => console.error(error));
