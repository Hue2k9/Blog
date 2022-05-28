const jwt = require("jsonwebtoken");
const asyncHandle = require("../Middlewares/asyncHandle");

const encode = asyncHandle(async (req, res) => {
  const document = req.body;
  const code = jwt.sign({ document }, process.env.SECRET_KEY, {
    expiresIn: "30m",
  });
  res.status(200).json({ code });
});

const decode = asyncHandle(async (req, res) => {
  const { code } = req.body;
  try {
    const decode = jwt.verify(code, process.env.SECRET_KEY);
    res.status(200).json({ decode });
  } catch (err) {
    res.send("Can not decode");
  }
});

module.exports = {
  encode,
  decode,
};
