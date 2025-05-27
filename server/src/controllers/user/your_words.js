const Word = require("../../models/word");
const YourWord = require("../../models/yourWord");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const { body, validationResult } = require("express-validator");
const {
  generatePaginationLinks,
} = require("../../utils/generatePaginationLinks");

const wordValidator = () => {
  return [
    body("word")
      .notEmpty()
      .withMessage("Word is required")
      .isString()
      .withMessage("Word must be a string"),
    body("meaning")
      .notEmpty()
      .withMessage("Meaning is required")
      .isString()
      .withMessage("Meaning must be a string"),
    body("pronunciation")
      .optional()
      .isString()
      .withMessage("Pronunciation must be a string"),
    body("example")
      .optional()
      .isString()
      .withMessage("Example must be a string"),
    body("ieltsLevel")
      .optional()
      .custom((value) => {
        if (value === null || value === undefined || value === "") return true;
        const num = Number(value);
        return Number.isInteger(num) && num >= 1 && num <= 9;
      })
      .withMessage("IELTS Level must be a number between 1 and 9."),
  ];
};

exports.getYourWords = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = "newest", timeFilter } = req.query;

  // UserId extraction
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID not found",
    });
  }

  // Build the query
  let query = { userId };

  // Determine sort order
  const sortOrder = sort === "oldest" ? 1 : -1;

  // Convert page and limit to numbers
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Build time filter if specified
  let timeFilterMatch = {};
  if (timeFilter) {
    const now = new Date();
    if (timeFilter === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilterMatch = { "wordId.createdAt": { $gte: oneWeekAgo } };
    } else if (timeFilter === "month") {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilterMatch = { "wordId.createdAt": { $gte: oneMonthAgo } };
    }
  }

  // Get paginated results using aggregate
  const yourWords = await YourWord.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(query.userId),
      },
    },
    {
      $lookup: {
        from: "words",
        localField: "wordId",
        foreignField: "_id",
        as: "wordId",
      },
    },
    { $unwind: "$wordId" },
    ...(Object.keys(timeFilterMatch).length > 0
      ? [{ $match: timeFilterMatch }]
      : []),
    { $sort: { "wordId.createdAt": sortOrder } },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum },
  ]);

  // Get total count for pagination after applying filters
  const total = await YourWord.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(query.userId),
      },
    },
    {
      $lookup: {
        from: "words",
        localField: "wordId",
        foreignField: "_id",
        as: "wordId",
      },
    },
    { $unwind: "$wordId" },
    ...(Object.keys(timeFilterMatch).length > 0
      ? [{ $match: timeFilterMatch }]
      : []),
    { $count: "total" },
  ]);

  const totalCount = total.length > 0 ? total[0].total : 0;

  // Check if no words found for the specified time period
  if (timeFilter && yourWords.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No words found for the specified time period",
    });
  }

  // Generate pagination links
  const paginationLinks = generatePaginationLinks(
    req,
    totalCount,
    pageNum,
    limitNum
  );

  res.status(200).json({
    success: true,
    data: yourWords,
    pagination: {
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(totalCount / limitNum),
      links: paginationLinks,
    },
  });
});

exports.createYourWord = [
  wordValidator(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { word, pronunciation, meaning, example, ieltsLevel } = req.body;
    const userId = req.user.userId;

    try {
      // create new word
      const newWord = await Word.create({
        word,
        pronunciation,
        meaning,
        example,
        ieltsLevel,
      });

      // create new user word
      const newUserWord = await YourWord.create({
        userId: userId,
        wordId: newWord._id,
      });

      res.status(201).json({
        success: true,
        data: {
          word: newWord,
          userWord: newUserWord,
        },
      });
    } catch (error) {
      throw error;
    }
  }),
];

exports.getYourWordById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const yourWord = await YourWord.findOne({
    userId: userId,
    wordId: id,
  }).populate("wordId");

  if (!yourWord) {
    return res.status(404).json({
      success: false,
      message: "Your word not found",
    });
  }

  res.status(200).json({
    success: true,
    data: yourWord,
  });
});

exports.deleteYourWord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const yourWord = await YourWord.findOne({
    _id: id,
    userId: userId,
  });

  if (!yourWord) {
    return res.status(404).json({
      success: false,
      message: "Your word not found",
    });
  }

  await YourWord.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Your word deleted successfully",
  });
});

exports.updateYourWord = [
  wordValidator(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { id } = req.params;
    const userId = req.user.userId;

    const { word, pronunciation, meaning, example, ieltsLevel } = req.body;

    // First find the YourWord document
    const yourWord = await YourWord.findOne({
      userId: userId,
      wordId: id,
    });

    if (!yourWord) {
      return res.status(404).json({
        success: false,
        message: "Your word not found",
      });
    }

    // Update the associated Word document
    await Word.updateOne(
      { _id: yourWord.wordId },
      { $set: { word, pronunciation, meaning, example, ieltsLevel } }
    );

    res.status(200).json({
      success: true,
      message: "Your word updated successfully",
    });
  }),
];
