const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
  },
  date: { type: Date },
  body: { type: String },
  author: { type: Schema.ObjectId },
  // comments: [Comment],
});

module.exports = mongoose.model("Comments", CommentSchema);
