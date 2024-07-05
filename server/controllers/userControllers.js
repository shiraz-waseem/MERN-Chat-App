const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // pic tw aik default rkhi huwi if user not provide
  if (!name || !email || !password) {
    res.status(400).json("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json("Failed to register User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json("Invalid Credentials");
    // throw new Error("Invalid Credentials");
  }
});

// api/user?search=shiraz
const allUsers = asyncHandler(async (req, res) => {
  // sending data to backend through body. But we dont want to send POST request so we will use queries

  // if there is any query inside of it we will search that in name or email. we will Or operator if either of these expressions is true return
  // if anyone of it matches return. What is i? the case insensitive match upper and lower both.
  // regex pattern matches
  // if dont match do nothing
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; // nothing

  // querying the database. Will find in the databases the keyword. We dont want the user that is logged in to be display
  // so req.user.id wala that is current logged in user dont return it not equal baqi return all.
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
