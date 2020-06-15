const express = require("express");
const bodyParser = require("body-parser");

// db instance connection
require("./config/db");

const app = express();
const port = process.env.PORT || 3301;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
