const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Checks that the request has a valid login token (JWT).
// If valid, attaches the logged-in user to req.user and continues.
async function protect(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// Must be used AFTER `protect`. Blocks anyone who isn't role === "admin".
function admin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}

module.exports = { protect, admin };
