require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateWithJwt = (req, res, next) => {
  // We are using Bearer auth.  The token is in the authorization header.
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check that the token is valid
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to the request for the next handler
    req.user = user;
    next();
  } catch (err) {
    console.log(
      `JWT verification failed at URL ${req.url}`,
      err.name,
      err.message
    );
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticateWithJwt;
