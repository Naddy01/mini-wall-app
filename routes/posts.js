const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const verifyToken = require("../verifyToken");

const {
  registerValidation,
  loginValidation,
  postValidation,
  commentValidation,
} = require("../validations/validation");

//post(to create data)
router.post("/", verifyToken, async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }

  

  const postData = new Post({
    userId: req.body.userId,
    username: req.body.username,
    title: req.body.title,
    text: req.body.text,
    likes: [],
    likesCount: 0,
    hashtag: req.body.hashtag,
  });
  // try to insert
  try {
    const postToSave = await postData.save();

    res.send(postToSave);
  } catch (err) {
    res.status(400).send({ message: "can not save post" });
  }
});

//GET 1 (READ) sending all the post to the authorised users
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ likesCount: -1, date: -1 });
    
    res.json(posts);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//GET 2 (READ) for users to get post by the ID given by the user
router.get("/:postId", verifyToken, async (req, res) => {
  try {
    const getPostById = await Post.findById(req.params.postId);
    //check if wrong post id provided
    if (!getPostById) {
      res.status(400).send({ message: "post not found" });
    }
    res.send(getPostById);
  } catch (err) {
    res.send({ message: err });
  }
});

//like and dislike a post
router.put("/:id/likes", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(req.params.id)
    if (post.username === req.body.username) {
      res.status(400).send({ message: "you can not like your own post" });
    } else {
      if (!post.likes.includes(req.body.username)) {
        post.likesCount = post.likesCount + 1;
        post.likes.push(req.body.username);
        await post.save();

        res.status(200).json("you have just liked a post");
      } else {
        res.status(200).json("you can only like this post ones");
      }
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
router.post("/comment/:id", verifyToken, async (req, res) => {
  const { error } = commentValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }
  try {
    const newComment = new Post({
      userId: req.body.userId,

      text: req.body.text,
    });
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      res.status(200).send({ message: "you can not comment on your own post" });
    } else {
      post.comments.unshift(newComment);
      await post.save();
      res.send(post.comments);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//PATCH(update)
//extract data from the user body using the id of the post and update the post
router.patch("/:id", verifyToken, async (req, res) => {
  //validate the body of the post
  const { error } = postValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error["details"][0]["message"] });
  }
  try {
    const post = await Post.findById(req.params.id);
    // check if the current user is the owner of the post
    if (post.userId === req.body.userId) {
      const updateByPostId = await post.updateOne({ $set: req.body }); //{ //update by matching the data

      res.send(updateByPostId); // send updated data back to user
    } else {
      res.status(400).send({ message: "you can update only your post" });
    }
  } catch (err) {
    res.send({ message: err });
  }
});

//delete
router.delete("/:postId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    // check if the current user is the owner of the post
    if (post.userId === req.body.userId) {
      const updateByPostId = await post.deleteOne(); //{ //update by matching the data

      res.send({ message: "One post has been deleted" }); // send updated data back to user
    } else {
      res.status(400).send({ message: "you can delete only your post" });
    }
  } catch (err) {
    res.send({ message: err });
  }
});

module.exports = router;
