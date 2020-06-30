const express = require("express");
const UserController = require("./controllers/UserController");
const app = express();

// Users
app
  .route("/users")
  .get(UserController.listAllUsers)
  .post(UserController.createNewUser);

app
  .route("/users/:userid")
  .get(UserController.getUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

//   TODO: app.route("/users/:userid/posts")

module.exports = app;
