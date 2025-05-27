const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const wordResultSchema = new mongoose.Schema({
  wordId: {
    type: mongoose.Schema.ObjectId,
    ref: "Word",
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const practiceHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  wordResults: [wordResultSchema],
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

practiceHistorySchema.plugin(paginate);

module.exports = mongoose.model("PracticeHistory", practiceHistorySchema);
