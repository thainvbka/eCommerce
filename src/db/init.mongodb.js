"use strict";

const mongoose = require("mongoose");
const MONGODB_URI = "mongodb://localhost:27017/shopDEV";
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }

  //connect to database
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 50, //mặc định là 100 kết nối, tăng giảm tùy theo nhu cầu
      })
      .then(() => {
        console.log(`Database connection successful`, countConnect()); //so luong ket noi
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
