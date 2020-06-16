const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

CategorySchema.pre("save", function (next) {
  (this.updatedOn = Date.now), next();
});

module.exports = mongoose.model("Categories", CategorySchema);
