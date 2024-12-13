const asyncHandler = require("express-async-handler");
const User = require("../models/user.js");
const generateToken = require("../utils/generateToken.js");
const OTP = require("../models/OTP.js");
const sendOtp = require("../utils/sendOtp.js");

const asyncUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(200).send({
      user: {
        _id: user._id,
        username: user.username,
        totalBalance: user.totalBalance,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(404).send({
      message: "Invalid email or password",
    });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    email: email,
    password: password,
    username: username,
  });

  if (user) {
    res.status(201).send({
      token: generateToken(user._id),
    });
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log("user id", req.user._id);
  res.status(200).send({
    user: {
      _id: user._id,
      username: user.username,
      totalBalance: user.totalBalance,
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const user = await User.find({ email: email });

  if (!user) {
    res.status(404);
    throw new Error("Email not found");
  }
  sendOtp(email);
  console.log("OTP sent successfully");
  res.status(200).json({ message: "Password reset OTP sent successfully" });
});

const resetPassword = asyncHandler(async (req, res) => {
  console.log("reset password");
  const { email, code, newPassword } = req.body;
  console.log(email, code, newPassword);

  //verify the OTP
  const otpEntry = await OTP.findOne({ email, code });

  console.log(otpEntry);
  if (!otpEntry) {
    res.status(400);
    throw new Error("Invalid OTP code");
  }

  if (otpEntry.expiresAt < Date.now()) {
    res.status(400);
    throw new Error("OTP code has expired");
  }

  console.log("OTP is valid");

  // if OTP is valid, proceed with password reset
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = newPassword;
  await user.save();

  //delete the OTP after successful password reset
  await OTP.deleteMany({ email });

  res.status(200).json({ message: "Password has been reset successfully" });
});

module.exports = {
  asyncUser,
  registerUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getUser,
};
