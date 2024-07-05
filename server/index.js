const express = require("express");
const dotenv = require("dotenv");
require("./db/conn");
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound } = require("./middleware/errorMiddleware");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());

app.use(cors());

// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API is running..");
});

// Error Handling middlewares
app.use(notFound);
// app.use(errorHandler);

PORT = 8000;

app.listen(PORT, () => {
  console.log(`listening to PORT no ${PORT}`);
});
