const mongoose = require("mongoose");
require("dotenv").config();

const dbURI = `mongodb+srv://admin:${process.env.DB_PASS}@cluster0-yr8wf.mongodb.net/test?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  (err) => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// Models - each creates a Collection
require("../models/Users");
require("../models/Comments");
require("../models/Posts");
require("../models/Categories");

module.exports = mongoose;
