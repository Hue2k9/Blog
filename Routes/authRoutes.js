const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

router.route("/login").post(authController.login).get(authController.loginView);

router
  .route("/forgot-password")
  .get(authController.forgotPasswordView)
  .post(authController.forgotPassword);

router
  .route("/change-password")
  .get(authController.changePasswordView)
  .post(authController.changePassword);

router.route("/cookie").get(authController.cookie);
module.exports = router;
