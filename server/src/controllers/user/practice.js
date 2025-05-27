const YourWord = require("../../models/yourWord");
const PracticeHistory = require("../../models/practiceHistory");
const asyncHandler = require("express-async-handler");

// Get random words from user's word list
exports.getRandomWords = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get user's word list
  const userWords = await YourWord.find({ userId })
    .populate("wordId")
    .limit(10);

  if (userWords.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No words found in your word list",
    });
  }

  // Shuffle the words
  const shuffledWords = userWords.sort(() => Math.random() - 0.5);

  // Format the response
  const practiceWords = shuffledWords.map((userWord) => ({
    wordId: userWord.wordId._id,
    word: userWord.wordId.word,
    meaning: userWord.wordId.meaning,
  }));

  res.status(200).json({
    success: true,
    data: practiceWords,
  });
});

// Save practice history
exports.savePracticeHistory = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { wordResults, score, totalQuestions } = req.body;

  // Validate wordResults
  if (!Array.isArray(wordResults) || wordResults.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Word results are required",
    });
  }

  const practiceHistory = await PracticeHistory.create({
    userId,
    wordResults,
    score,
    totalQuestions,
  });

  res.status(201).json({
    success: true,
    data: practiceHistory,
  });
});
