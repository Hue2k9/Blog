const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../Middlewares/authMiddleware");
const docController = require("../Controllers/docController");
router.post("/encode", authenticateToken, docController.encode);
router.post("/decode", authenticateToken, docController.decode);
module.exports = router;
