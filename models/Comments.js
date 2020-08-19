const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  body: { type: String },
  author: {
    type: Schema.ObjectId,
    ref: "Users",
    required: true,
    // TODO - add default: "Anonymous",
  },
  replies: [this],
});

module.exports = mongoose.model("Comments", CommentSchema);
