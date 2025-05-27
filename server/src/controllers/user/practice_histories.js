const PracticeHistory = require("../../models/practiceHistory");
const asyncHandler = require("express-async-handler");
const {
  generatePaginationLinks,
} = require("../../utils/generatePaginationLinks");

exports.getPracticeHistories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID not found",
    });
  }

  let query = { userId };

  const total = await PracticeHistory.countDocuments(query);

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const practiceHistories = await PracticeHistory.find({ userId })
    .sort({ createdAt: -1 })
    .select("score totalQuestions createdAt")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  const paginationLinks = generatePaginationLinks(
    req,
    total,
    pageNum,
    limitNum
  );

  res.status(200).json({
    success: true,
    data: practiceHistories,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      links: paginationLinks,
    },
  });
});

exports.getPracticeHistoryById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const practiceHistoryId = req.params.id;

  const practiceHistory = await PracticeHistory.findOne({
    _id: practiceHistoryId,
    userId: userId,
  }).populate({
    path: "wordResults.wordId",
    select: "word meaning",
  });

  if (!practiceHistory) {
    res.status(404);
    throw new Error("Practice history not found");
  }

  res.status(200).json({
    success: true,
    data: practiceHistory,
  });
});

exports.deletePracticeHistory = asyncHandler(async (req, res) => {
  const practiceHistoryId = req.params.id;

  await PracticeHistory.deleteOne({ _id: practiceHistoryId });

  res.status(200).json({
    success: true,
    message: "Practice history deleted successfully",
  });
});

exports.updatePracticeHistory = asyncHandler(async (req, res) => {
  const practiceHistoryId = req.params.id;
  const { score, totalQuestions } = req.body;

  const practiceHistory = await PracticeHistory.findById(practiceHistoryId);

  if (!practiceHistory) {
    res.status(404);
    throw new Error("Practice history not found");
  }

  practiceHistory.score = score;
  practiceHistory.totalQuestions = totalQuestions;
  await practiceHistory.save();

  res.status(200).json({
    success: true,
    message: "Practice history updated successfully",
    data: practiceHistory,
  });
});
