const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);

      req.user = await User.findById(decoded.user_id).select("-password");
      next();
    } catch (error) {
      console.log(error);

      res.status(401);
      throw new Error("Not authorized, token failed ");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized,  no token found");
  }
});

module.exports = authMiddleware;
