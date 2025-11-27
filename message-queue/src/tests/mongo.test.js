"use strict";

const mongoose = require("mongoose");
const connectString = "mongodb://localhost:27017/shopDEV";

const TestShcema = new mongoose.Schema({
  name: String,
});

const TestModel = mongoose.model("Test", TestShcema);

describe("MongoDB Connection", () => {
  beforeAll(async () => {
    await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should connect to MongoDB ", async () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 means connected
  });

  it("should save a document to the test collection", async () => {
    const testDoc = new TestModel({ name: "Test Document" });
    const savedDoc = await testDoc.save();
    expect(testDoc.isNew).toBe(false); // Document should be saved
  });

  it("should find a document in the test collection", async () => {
    const testDoc = await TestModel.findOne({ name: "Test Document" });
    expect(testDoc).toBeDefined();
    expect(testDoc.name).toBe("Test Document");
  });
});
