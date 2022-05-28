const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const asyncHandle = require("../Middlewares/asyncHandle");
const ErrorResponse = require("../common/ErrorResponse");
const dotenv = require("dotenv");

dotenv.config();

module.exports.authorization = async function (req, res, next) {
  let { id } = req.params;
  let user = await User.findById(id);

  if (!user) return res.send("User does not exist");

  if (user.role !== "admin") return res.send("User does not have permission");
  next();
};

module.exports.auth = (req, res, next) => {
  // let tokens = req.signedCookies?.tokens;
  // if (!tokens) {
  //   return next(new Error("Cookie không tìm thấy"));
  // }
  // let { access } = tokens;
  // const payload = jwt.verify(access.token, config.jwt.secret);
  // if (payload) {
  //   req.userId = payload.sub;
  //   return next();
  // }
};

//protect
module.exports.authenticateToken = asyncHandle(async (req, res, next) => {
  let token;
  token = req.cookies.token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   // Set token from Bearer token in header
  //   token = req.headers.authorization.split(" ")[1];
  // }
  // Make sure token exists
  if (!token) {
    return res.redirect("http://localhost:3000/api/auth/login");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.redirect("http://localhost:3000/api/auth/login");
  }
});
