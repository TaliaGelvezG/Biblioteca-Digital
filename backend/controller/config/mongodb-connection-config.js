const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_CONNECTION)
  .then(() => {
    console.info("Mongodb Connected");
  })
  .catch((error) => {
    console.error("An error was presented: " + error);
  });