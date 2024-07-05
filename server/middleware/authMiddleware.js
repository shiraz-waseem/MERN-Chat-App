const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // authorization has something and it starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // we have the token. It will be Bearer token so split krke token le lia and removed Bearer
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = jwt.verify(token, "SECRET_KEY");

      // user object mein and return it without password
      req.user = await User.findById(decoded.id).select("-password");
      next(); // all done move to next operation
    } catch (error) {
      res.status(401).json("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401).json("Not authorized, no token");
  }
});

module.exports = { protect };
