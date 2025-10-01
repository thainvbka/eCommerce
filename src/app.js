const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

//init middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
//init db

//import routes
app.use("/", (req, res, next) => {
  res.status(200).json({ message: "Wellcome eCommerce API" });
});

//handling errors

module.exports = app;
