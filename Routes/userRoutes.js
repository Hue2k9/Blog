const express = require("express");
const userController = require("../Controllers/UserController");
const userRouter = express.Router();
const auth = require("../Middlewares/authMiddleware");
userRouter
  .route("/sign-up")
  .post(userController.addUser)
  .get(userController.addUserView);

userRouter
  .route("/:id")
  .get(auth.authenticateToken, userController.getUser)
  .put(auth.authenticateToken, userController.updateUser)
  .delete(auth.authenticateToken, userController.deleteUser);
userRouter
  .route("/:id/getall")
  .get(auth.authenticateToken, auth.authorization, userController.getAllUsers);

module.exports = userRouter;
