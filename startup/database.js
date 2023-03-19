const mongoose = require("mongoose");

const dbpath = process.env.MONGO_SECRET;

if (!dbpath) {
  console.error("No db secret...");
}

const connectDatabase = async () => {
  await mongoose
    .connect(dbpath)
    .then(() => console.log("Connected to mongo db..."))
    .catch((err) => console.log("error to connect db" + err));
};

module.exports = { connectDatabase };
