const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Get All Posts

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          model: "user",
        },
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create New Post

router.post("/", async (req, res) => {
  try {
    const data = {
      postText: req.body.postText,
      createdAt: req.body.createdAt,
      createdBy: req.body.createdBy,
      imageUrl: req.body.imageUrl,
    };

    const postRes = await Post.create(data);
    await postRes.save();

    res.status(201).json(postRes);
  } catch (error) {
    // console.log("Error");
    res.status(500).json({ message: error.message });
  }
});

//Like/Dislike Post
router.put("/like/:postId", async (req, res) => {
  // console.log("Enter");
  try {
    const postId = req.params.postId;
    const data = {
      userId: req.body.userId,
      isLike: req.body.isLike,
    };

    // console.log(data);
    const post = await Post.findById(postId);
    // console.log(post);
    if (!post.likes) {
      const updatePost = await Post.findByIdAndUpdate(
        postId,
        { likes: [] },
        { upsert: true, runValidators: true }
      );
      await updatePost.save();
    }
    const updatedPost = await Post.findById(postId);
    data.isLike
      ? updatedPost.likes.push(data.userId)
      : updatedPost.likes.pop(data.userId);
    const result = await updatedPost.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  // res.send("received")
});

module.exports = router;
