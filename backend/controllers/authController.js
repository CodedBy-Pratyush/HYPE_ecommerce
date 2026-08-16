const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Creates a signed login token containing the user's id.
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Options for the cookie that stores the login token in the browser.
const cookieOptions = {
  httpOnly: true, // JavaScript in the browser can't read it (safer)
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    res
      .cookie("token", signToken(user._id), cookieOptions)
      .status(201)
      .json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const passwordMatches = user && (await user.comparePassword(password));
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res
      .cookie("token", signToken(user._id), cookieOptions)
      .json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie("token").json({ success: true });
};

// GET /api/auth/me — used by the frontend to check "am I logged in?"
exports.me = async (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ success: true, user: { id: _id, name, email, role } });
};
