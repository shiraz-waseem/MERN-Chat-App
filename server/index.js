const express = require("express");
const dotenv = require("dotenv");
require("./db/conn");
dotenv.config();
// const userRoutes = require("./routes/userRoutes");

// middlewares
const app = express();

// routes
// app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running..");
});

PORT = 8000;

app.listen(PORT, () => {
  console.log(`listening to PORT no ${PORT}`);
});
