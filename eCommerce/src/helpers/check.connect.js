"use strict";
const mongoose = require("mongoose");
const os = require("os");

const _SECONDS = 5000;

//đếm số kết nối hiện tại
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

//kiểm tra quá tải kết nối
// const checkOverload = () => {
//   setInterval(() => {
//     const numConnection = mongoose.connections.length;
//     const numCores = os.cpus().length;
//     const memoryUsage = process.memoryUsage().rss / 1024 / 1024; //MB

//     console.log(`Active connections: ${numConnection}`);
//     console.log(`Memory usage: ${memoryUsage} MB`);

//     //giả sử mỗi core xử lý được 100 kết nối
//     const maxConnections = numCores * 100;
//     if (numConnection > maxConnections) {
//       console.log("Overload connections");
//     } else {
//       console.log("Connections are normal");
//     }
//   }, _SECONDS);
// };

module.exports = {
  countConnect,
};
