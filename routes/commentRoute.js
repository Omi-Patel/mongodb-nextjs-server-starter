const express = require("express");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

// Create New Comment

router.post("/", async (req, res) => {
  try {
    const post = await Post.findById(req.body.post);
    const commentRes = await Comment.create(req.body);
    post?.comments.push(commentRes._id);
    post.save();
    res.status(201).json(commentRes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Comment
router.delete("/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const commentDeleteRes = await Comment.findByIdAndDelete({ _id: commentId });
    res.status(201).json(commentDeleteRes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
