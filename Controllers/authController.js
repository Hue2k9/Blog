const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const asyncHandle = require("../Middlewares/asyncHandle");
const ErrorResponse = require("../common/ErrorResponse");
const crypto = require("crypto");

module.exports.loginView = asyncHandle(async (req, res) => {
  res.render("pages/SignIn/SignIn.ejs");
});

module.exports.login = asyncHandle(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.send("Người dùng không tồn tại");
  }
  if (!(await user.isPasswordMatch(password))) {
    return res.send("Tài khoản hoặc mật khẩu không chính xác");
  }
  const token = jwt.sign({ username }, process.env.SECRET_KEY, {
    expiresIn: "30m",
  });
  res.cookie("token", token);
  res.redirect("/api/posts/home");
  // res.status(200).json({ token });
});

module.exports.cookie = asyncHandle(async (req, res, next) => {
  // res.cookie("user", 12345);
  // res.send("Hello");
});

module.exports.forgotPassword = asyncHandle(async (req, res) => {
  const { email } = req.body;

  console.log(req.body);
  if (!email) return res.send("Vui long nhap email");
  const user = await User.findOne({ email });

  if (!user) return res.send("Nguoi dung khong ton tai");
  let code = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  res.send(`localhost:3000/api/auth/change-password?code=${code}`);
});

module.exports.forgotPasswordView = asyncHandle(async (req, res) => {
  res.render("pages/ChangePassword/sendEmail.ejs");
});

module.exports.changePasswordView = asyncHandle(async (req, res) => {
  const { code } = req.query;
  res.render("pages/ChangePassword/changePassword.ejs", { code });
});

module.exports.changePassword = asyncHandle(async (req, res, next) => {
  const { code } = req.query;
  const user = await User.findOne({
    resetPasswordToken: code,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Khong the doi password");
  }

  // Set new password
  user.password = req.body.password;
  let passwordagain = req.body.passwordagain;

  if (user.password != passwordagain)
    res.status(400).send("Mat khau phai trung khop");

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.send("change  password successfuly");
});
