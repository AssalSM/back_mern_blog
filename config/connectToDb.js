const mongoose = require("mongoose");

require('dotenv').config()
mongoose.set('strictQuery', false);
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("hello connect ")
  } catch (error) {
    console.log("connect failed to mongo db", error);
  }
};
