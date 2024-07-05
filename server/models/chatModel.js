const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true }, // After and before space chali jaye agar hai
    isGroupChat: { type: Boolean, default: false },
    // will be an array a single chat will have 2 users and groupchat will have more users
    users: [
      {
        type: mongoose.Schema.Types.ObjectId, // this will contain id to that particiular user a single user will store
        ref: "User", // Ref to User model
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
