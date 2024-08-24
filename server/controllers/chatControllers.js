const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // if the chat with this userId exists return otherwise create
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // if the chat exist with this user. If its one of one chat groupChat will be false and we will find both of the user current logged in user and the userId we are provided with
  // and both req have to be true. chat model mein users ha ref User. First one is equal to current user logged in and the second we sent
  // we want more info so we will populate wrna sirf id milti and password nahi chae tw -
  // latest message also contains only id in Chat Model and we want the message so populate

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // sender field bhi populate krni. jo populate krna cheze sender ki woh..
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  // if isChat hai and ziada hai boht saari arhy then res mein bhejdo pheli since sirf 1 hi chat exist krti hugy na upper jo and laga ke 2 ids bheji..
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // wrna create a new chat with these two
    // current logged in user and the user id we provided
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    // storing this chat that is creating
    try {
      const createdChat = await Chat.create(chatData);

      // now the chat that is created we will send it to user and we will find the chat that is created with this id and then will populate the user array
      const FullChat = await Chat.findOne({ _id: createdChat.id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (e) {
      res.status(400).json(e.message);
      // throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    // we need to check which user is logged in and query it and get all the chats
    const results = Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }) // users array ha na chatModel just match this

      // populate all the things you want to return. Agar populate na laga ke direct res maang lo tw bhi aya ga but with limited cheze that in chatModel
      .populate("users", "-password") // users ki details both
      .populate("groupAdmin", "-password")
      .populate("latestMessage") // all the latestMessage fields
      .sort({ updatedAt: -1 }) // new to old
      // .then((result) => res.send(result));
      .then(async (results) => {
        // return it
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (e) {
    res.status(400).json(e.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  console.log(req.body);
  // Frontend sy Chat Name and all of the Users search sy arhy hugy
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  // we will send error if less then 2. we get in stringify format from frontend and backend mein parse krlein gy
  // JSON.parse() converts this JSON string into a JavaScript array
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    // this user (logged in) + jo search mein req.body bhej rhy
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group chat" });
  }

  // group chat mein ham bhi tw apna apko bhi
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true } // agar true na put krte it will return us the old name
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }, // pushing userId in users array
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password"); // will display groupAdmin user all details except password alag sy

  if (!added) {
    res.status(404).json("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId }, // pushing userId in users array
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password"); // will display groupAdmin user all details except password alag sy

  if (!removed) {
    res.status(404).json("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
