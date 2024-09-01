const express = require("express");
const dotenv = require("dotenv");
require("./db/conn");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoute");
const { notFound } = require("./middleware/errorMiddleware");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());

app.use(cors());

// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running..");
});

// Error Handling middlewares
app.use(notFound);
// app.use(errorHandler);

PORT = 8000;

const server = app.listen(PORT, () => {
  console.log(`listening to PORT no ${PORT}`);
});

// it takes a function and cors
const io = require("socket.io")(server, {
  pingTimeout: 60000, // amount of time it will wait being inactive. It gonna wait 60 seconds and user didnt send any message it will close the connection the bandwidth
  cors: {
    origin: "http://localhost:3000",
  },
});

// Establishing connection (Creating). Name and call back chae

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  // Joining the chat
  // will take room id from frontend
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined the room", room);
  });

  // for typing. Creating the socket. Server received from frontend typing and infromed all in the room that typing through emit
  socket.on("typing", (room) => socket.in(room).emit("typing")); // jo us room mein un sb ko typing bhej do

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing")); // jo us room mein un sb ko typing bhej do

  socket.on("new message", (newMessageRecieved) => {
    // console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat; // got chat data
    if (!chat.users) return console.log("chat users not defined");

    // If We are a user and sending a message we want except for us we want it to be emitted to rest of users.
    // It should receive to other participants
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return; // not necessary tho

      // so for other user it gonna send
      socket.in(user._id).emit("message received", newMessageRecieved); // WE WILL TAKE newMessageReceived in frontend and see where it belongs on which chat
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
