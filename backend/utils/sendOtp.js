const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const OTP = require("../models/OTP.js");
require("dotenv").config();
// Generate a random 6-digit number
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "login",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
const sendOtp = async (email) => {
  try {
    const resetCode = generateResetCode();
    console.log(process.env.SMTP_USER, process.env.SMTP_PASS);

    const expirationTime = new Date(Date.now() + 10 * 60000);

    // Store OTP in the database
    await OTP.create({
      email: email,
      code: resetCode,
      expiresAt: expirationTime,
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Dear User,</p>
        <p>You requested to reset your password. Please use the following code to reset your password:</p>
        <h2>${resetCode}</h2>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br> Dagmaros</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("senttt", info);
    return info;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

module.exports = sendOtp;
