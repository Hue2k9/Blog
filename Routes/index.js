const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");
const postRouter = require("./postRoutes");
const docRouter = require("./docRoutes");

module.exports = (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/doc", docRouter);
};
