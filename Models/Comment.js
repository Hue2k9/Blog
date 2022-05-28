const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentsSchema = new Schema(
  {
    author: String,
    content: String,
    post: { type: Schema.Types.ObjectId, ref: "posts" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", commentsSchema);
