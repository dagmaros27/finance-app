const express = require("express");
const {
  asyncUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getUser,
} = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.get("/", authMiddleware, getUser);
router.post("/", registerUser);
router.post("/login", asyncUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
