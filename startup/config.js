const cors = require("cors");
// const errorHandler = require("../middleware/errorHandler");
const express = require("express");
const fileUploader = require("express-fileupload");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({
  path: path.join(process.cwd(), "/config/.env"),
});
require("express-async-errors");
module.exports = (app) => {
  app.use(fileUploader());
  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(helmet());
  app.use(morgan("tiny"));
  app.use(cookieParser());
  // parse application/x-www-form-urlencoded
  app.use(
    express.urlencoded({
      extended: true,
      limit: "50mb",
      parameterLimit: 100000,
    })
  );
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // Switch off the default 'X-Powered-By: Express' header
    app.disable("x-powered-by");
    // OR set your own header here
    res.setHeader("X-Powered-By", "Mehdi App v0.0.1");
    next();
  });
};
