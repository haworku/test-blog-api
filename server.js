const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");

// establish server
const app = express();

// middleware to parse api responses
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// define api routes
app.use(router);

module.exports = app;
