const mongoose = require("mongoose");
const Comments = require("./Comments");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
  },
  status: {
    type: Boolean,
    enum: ["draft", "published"],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
  },
  comments: { type: [Comments.Schema] },
  author: { type: Schema.ObjectId, ref: "Users" },
});

PostSchema.methods.findAuthor = function (callback) {
  return this.db.model("User").findById(this.author, callback);
};

PostSchema.pre("save", function (next) {
  this.slug = slugify(this.title);
  next();
});

module.exports = mongoose.model("Posts", PostSchema);

// from https://scotch.io/courses/create-a-crud-app-with-node-and-mongodb/a-mongoose-model
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
