const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");

// establish db instance connection
require("./config/db");

// establish server
const app = express();

// middleware to parse api responses
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use node api
app.use(router);

// listen for connections
const port = process.env.PORT || 3301;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
