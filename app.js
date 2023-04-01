const dotenv = require("dotenv");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const createError = require("http-errors");

dotenv.config();

const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/users");

const { connectDatabase } = require("./config/database.js");

connectDatabase();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);
app.use("/public", express.static("public"));

/*app.use((req, res) => {
  res.status(404).json({ message: "Not found !!!!" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});*/

//multer
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

module.exports = app;
