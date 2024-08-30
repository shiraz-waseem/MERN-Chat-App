const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  // What are required to send message? ChatId on which we are sending, the actual message and the sender. Sender middleware sy ajaya ga logged in user
  // The other two things from body
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400); // return an error
  }

  // sending the new message
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    // query our database
    var message = await Message.create(newMessage);

    // we will populate the sender and our message and the users array inside the chatId. each chat has a bunch of users so we will populate and create a whole object
    message = await message.populate("sender", "name pic"); // directly populate nahi but we are populating the instance of mongoose class so execPopulate
    // getting everything inside chat object
    message = await message.populate("chat");

    // each chat has list of users so lets populate. Issy users upper jo message mein ana wo just 2 ids arhy now name email pic arhy
    message = await User.populate(message, {
      // message mein jakr chat ke andr users ha woh lelo
      path: "chat.users",
      select: "name email pic",
    });

    // when new message come it replace the previous message
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (e) {
    console.log("In catch console");
    res.status(400).json(e.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "name pic"
    );
    res.json(messages);
  } catch (e) {
    console.log("In catch console");
    res.status(400).json(e.message);
  }
});

module.exports = { sendMessage, allMessages };
