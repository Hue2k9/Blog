const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "This field is required"],
    minlength: [2, "Name must be at least 2 characters"],
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  age: Number,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//Mã hóa password
userSchema.pre("save", async function (next) {
  const user = this;
  console.log(this);

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256", process.env.SECRET_KEY)
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire =
    Date.now() + process.env.RESET_TOKEN_EXPIRE * 60 * 1000;
  return this.resetPasswordToken;
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    (process.env.SECRET_KEY = {
      expiresIn: process.env.RESET_TOKEN_EXPIRE,
    })
  );
};

module.exports = mongoose.model("users", userSchema);
