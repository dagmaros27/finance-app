const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const token = jwt.sign({ user_id: id }, process.env.JWT_TOKEN_KEY, {
    expiresIn: "30d",
  });

  return token;
};

module.exports = generateToken;
