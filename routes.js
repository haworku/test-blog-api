const express = require("express");

const CommentController = require("./controllers/CommentController");
const UserController = require("./controllers/UserController");
const app = express();

// USERS
app
  .route("/users")
  .get(UserController.listAllUsers)
  .post(UserController.createNewUser);

app
  .route("/users/:userid")
  .get(UserController.getUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

app.route("/users/:userid/comments").get(UserController.getUserComments);

// COMMENTS
app
  .route("/comments")
  .get(CommentController.listAllComments)
  .post(CommentController.createNewComment);

app
  .route("/comments/:commentid")
  .get(CommentController.getComment)
  .put(CommentController.updateComment)
  .delete(CommentController.deleteComment);

module.exports = app;
