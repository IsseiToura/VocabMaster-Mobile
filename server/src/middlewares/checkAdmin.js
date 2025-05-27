const checkAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

module.exports = checkAdmin;
