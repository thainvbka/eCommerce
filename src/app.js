const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
const app = express();
// const { checkOverload } = require("./helpers/check.connect");

//init middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

// parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
const db = require("./db/init.mongodb");
// checkOverload(); //kiểm tra quá tải kết nối

//import routes
app.use("", require("./routes"));

//handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
