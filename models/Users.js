const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) throw new Error("Age must be greater than 0.");
    },
  },
  // TODO: add lastModified, handled in controller
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.findPosts = function (callback) {
  return this.db.model("Post").findById(this._id, callback);
};

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Users", UserSchema);
