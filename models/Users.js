const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
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
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

module.exports = mongoose.model("Users", UserSchema);
