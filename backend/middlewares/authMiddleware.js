const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/.env" });

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(411).json({
      message: "Authorization header is missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "JWT Verification failed",
      error: e.message,
    });
  }
};

module.exports = authMiddleware;
