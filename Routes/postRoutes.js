const express = require("express");
const postController = require("../Controllers/postController");
const postRouter = express.Router();
const { authenticateToken } = require("../Middlewares/authMiddleware");

postRouter.route("/").get(authenticateToken, postController.getAllPost);
postRouter
  .route("/create")
  .post(authenticateToken, postController.createPost)
  .get(authenticateToken, postController.createPostView);

postRouter.route("/home").get(authenticateToken, postController.home);

postRouter
  .route("/edit/:id")
  .get(authenticateToken, postController.editPostView)
  .put(authenticateToken, postController.editPost);

postRouter
  .route("/:id")
  .get(authenticateToken, postController.blogDetail)
  .delete(authenticateToken, postController.deletePost)
  .post(authenticateToken, postController.comments);
// postRouter.get(postController.getPostByUserId);
module.exports = postRouter;
