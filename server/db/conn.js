const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();

mongoose
  .connect(
    "mongodb+srv://shirazwaseem321:qRwu2cbsDjOHDHqH@cluster0.0agimue.mongodb.net/chatappdatabase?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connection successfully");
  })
  .catch((e) => {
    console.log(e);
  });
