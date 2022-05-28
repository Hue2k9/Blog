const Post = require("../Models/Post");
const User = require("../Models/User");
const Comment = require("../Models/Comment");
const auth = require("../Controllers/authController");
const asyncHandle = require("../Middlewares/asyncHandle");
const jwt = require("jsonwebtoken");

const createPost = asyncHandle(async (req, res) => {
  // const { id } = req.params;
  // const author = await User.findById(id);
  let token;
  token = req.cookies.token;
  const users = jwt.verify(token, process.env.SECRET_KEY);

  const user = await User.find({ username: users.username });
  const { title, content } = req.body;
  const author = user[0]._id;
  const post = new Post({ title, author, content });
  await post.save();
  res.redirect("/api/posts/home");
});

const createPostView = asyncHandle(async (req, res) => {
  let token;
  token = req.cookies.token;
  const user = jwt.verify(token, process.env.SECRET_KEY);
  res.render("pages/blogs/PostBlog.ejs", { user: user });
});

//blog detail, comment
const blogDetail = asyncHandle(async (req, res) => {
  let { id } = req.params;
  let posts = await Post.findById(id).populate("author", "username");
  let token;
  token = req.cookies.token;
  const user = jwt.verify(token, process.env.SECRET_KEY);

  let comments = await Comment.find({ post: id });
  res.render("pages/blogs/blogDetail.ejs", {
    user: user,
    posts: posts,
    comments,
  });
});

//http://localhost:3000/api/posts/home?page=2
const home = asyncHandle(async (req, res) => {
  let token;
  token = req.cookies.token;
  const user = jwt.verify(token, process.env.SECRET_KEY);
  const page_size = 2;
  var page = req.query.page;
  if (page) {
    page = parseInt(page);
    var soLuongBoQua = (page - 1) * page_size;
    Post.find()
      .populate("author", "username")
      .skip(soLuongBoQua)
      .limit(page_size)
      .then((posts) => {
        res.render("pages/blogs/blogHome.ejs", { user: user, posts: posts });
      })
      .catch((err) => {
        res.status(500).json("Loi server");
      });
  } else {
    Post.find({})
      .then((posts) => {
        res.render("pages/blogs/blogHome.ejs", { user: user, posts: posts });
      })
      .catch((err) => {
        res.status(500).json("Loi server");
      });
  }
});

//http://localhost:3000/api/posts?page=1
const getAllPost = asyncHandle(async (req, res) => {
  const page_size = 2;
  var page = req.query.page;
  if (page) {
    page = parseInt(page);
    var soLuongBoQua = (page - 1) * page_size;
    Post.find()
      .populate("author", "username")
      .skip(soLuongBoQua)
      .limit(page_size)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json("Loi server");
      });
  } else {
    Post.find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json("Loi server");
      });
  }
});

const getPostByUserId = asyncHandle(async (req, res) => {
  let { id } = req.params;
  let posts = await Post.find({ author: id }).populate("author");
  res.json(posts);
});

const editPostView = asyncHandle(async (req, res) => {
  let { id } = req.params;
  let posts = await Post.findById(id).populate("author", "username");
  let token;
  token = req.cookies.token;
  const user = jwt.verify(token, process.env.SECRET_KEY);
  res.render("pages/blogs/edit.ejs", { user: user, posts: posts });
});

const editPost = asyncHandle(async (req, res) => {
  let { id } = req.params;
  await Post.findByIdAndUpdate(id, req.body);
  res.redirect("http://localhost:3000/api/posts/home");
});

const deletePost = asyncHandle(async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("http://localhost:3000/api/posts/home");
});

const comments = asyncHandle(async (req, res) => {
  let token;
  token = req.cookies.token;
  const users = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.find({ username: users.username });
  const author = user[0].username;
  let { post } = req.params;
  let content = req.body;
  const comment = new Comment({ post, author, content });
  await comment.save();
  res.redirect(`http://localhost:3000/api/posts/${post}`);
});

module.exports = {
  createPost,
  getAllPost,
  getPostByUserId,
  createPostView,
  home,
  blogDetail,
  editPost,
  editPostView,
  deletePost,
  comments,
};
