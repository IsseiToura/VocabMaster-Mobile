const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  pronunciation: {
    type: String || null,
  },
  meaning: {
    type: String,
    required: true,
  },
  example: {
    type: String || null,
  },
  ieltsLevel: {
    type: Number || null,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, null],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Word", wordSchema);
