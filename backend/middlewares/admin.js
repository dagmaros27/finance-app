const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "ROLE_ADMIN") {
    res.status(403);
    throw new Error("The user is not allowed");
  }

  next();
});

//for role based access control
// const accessMiddleware = (roles) => asyncHandler(async (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     res.status(403);
//     throw new Error("The user is not allowed");
//   }

//   next();
// });

module.exports = adminMiddleware;
