const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const indexRouter = require("./src/routes/index");

const app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

const mongoDB =
  process.env.MONGODB_URI || "mongodb://localhost:27017/task-manager";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    exposedHeaders: ["Authorization", "Link"],
    origin: "*",
  })
);

// Basic rate limiters
const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
  message: "Too many requests, please try again later.",
});

app.use((req, res, next) => {
  if (req.user) {
    limiter(req, res, next);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  console.log(`Received request for route: ${req.originalUrl}`);
  next();
});

app.use("/api", indexRouter);

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
