const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../../models/user");

exports.register = asyncHandler(async (req, res) => {
  const { username, password, isAdmin } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ username, password, isAdmin });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  res.status(200).json({ token });
});
