const { default: mongoose } = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentText: String,
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  createdAt: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("comment", commentSchema);
