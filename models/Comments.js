const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
  },
  date: { type: Date },
  body: { type: String },
  author: {
    type: Schema.ObjectId,
    ref: "Users",
    required: false,
    default: "anonymous",
  },
  replies: [this],
});

exports.Schema = CommentSchema;
exports.Model = mongoose.model("Comments", CommentSchema);
