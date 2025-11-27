"use strict";
const { testConnection } = require("../db/init.rabbit");

describe("RabbitMQ Connection", () => {
  it("should connect to RabbitMQ and send a test message", async () => {
    const result = await testConnection();
    expect(result).toBeUndefined(); // testConnection does not return anything
  });
});
