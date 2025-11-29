const amqp = require("amqplib");
const message = "hello RabbitMQ Nguyen Van Thai";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx";
    const notiQueue = "notificationQueueProcess";
    const notificationExchangeDLX = "notificationExDLX";
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    //1.create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    //2. create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, //cho phep nhieu consumer cung luc nhan message
      deadLetterExchange: notificationExchangeDLX, // setup DLX
      deadLetterRoutingKey: notificationRoutingKeyDLX, //setup routing key DLX
    });

    //3. bind queue to exchange
    await channel.bindQueue(
      queueResult.queue,
      notificationExchange,
      "" //routing key mac dinh la rong
    );

    //4. send message to exchange
    const msg = "a new product has been created";
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000", // message se bi xoa sau 10s neu khong dc xu ly
    });
    console.log("Message sent to RabbitMQ:", msg);

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error in RabbitMQ producer:", error);
  }
};

runProducer().catch((error) => console.error(error));
