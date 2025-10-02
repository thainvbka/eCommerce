const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
// const { checkOverload } = require("./helpers/check.connect");

//init middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

//init db
const db = require("./db/init.mongodb");
// checkOverload(); //kiểm tra quá tải kết nối

//import routes
app.use("/", (req, res, next) => {
  res.status(200).json({ message: "Wellcome eCommerce API" });
});

//handling errors

module.exports = app;
