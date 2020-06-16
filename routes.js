const express = require("express");
const UserController = require("./controllers/UserController");
const app = express();

// Users
app.route("/users").get(UserController.listAllUsers);

module.exports = app;
