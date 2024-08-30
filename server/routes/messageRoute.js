const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);

// fetch all of the messages for one single chat
router.get("/:chatId", protect, allMessages);

module.exports = router;
