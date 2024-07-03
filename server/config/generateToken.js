const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "SECRET_KEY", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
