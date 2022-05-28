const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "users" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);
