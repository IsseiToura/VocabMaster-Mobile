const User = require("../../models/user");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");
const {
  generatePaginationLinks,
} = require("../../utils/generatePaginationLinks");

const userValidator = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isString()
      .withMessage("Username must be a string"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString()
      .withMessage("Password must be a string"),
    body("isAdmin")
      .optional()
      .isBoolean()
      .withMessage("IsAdmin must be a boolean"),
  ];
};

exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const users = await User.find({}).sort({ createdAt: -1 });
  const total = users.length;

  const paginationLinks = generatePaginationLinks(req, total, page, limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      links: paginationLinks,
    },
  });
});

exports.createUser = [
  userValidator(),
  asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { username, password, isAdmin } = req.body;
    const user = await User.create({ username, password, isAdmin });
    res.status(201).json({
      success: true,
      data: user,
    });
  }),
];

exports.getUserById = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  await User.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

exports.updateUser = [
  userValidator(),
  asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { username, password, isAdmin } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.username = username;
    user.password = password;
    user.isAdmin = isAdmin || false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  }),
];
