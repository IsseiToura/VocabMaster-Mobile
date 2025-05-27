const mongoose = require("mongoose");

const wordGenerationLimitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  lastResetDate: {
    type: Date,
    default: Date.now,
  },
  count: {
    type: Number,
    default: 0,
  },
});

// reset the count when the date changes
wordGenerationLimitSchema.methods.checkAndReset = function () {
  const today = new Date();
  const lastReset = new Date(this.lastResetDate);

  // if the date changes (date comparison)
  if (
    today.getDate() !== lastReset.getDate() ||
    today.getMonth() !== lastReset.getMonth() ||
    today.getFullYear() !== lastReset.getFullYear()
  ) {
    this.count = 0;
    this.lastResetDate = today;
  }
};

const WordGenerationLimit = mongoose.model(
  "WordGenerationLimit",
  wordGenerationLimitSchema
);

module.exports = WordGenerationLimit;
