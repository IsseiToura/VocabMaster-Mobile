const mongoose = require("mongoose");

/**
 * Middleware to validate MongoDB ObjectID
 * @param {string} paramName - The request parameter to validate
 */
const validateMongoId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid MongoDB ObjectID" });
    }
    next();
  };
};

module.exports = validateMongoId;
