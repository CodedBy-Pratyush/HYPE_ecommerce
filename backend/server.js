// Load variables from the .env file (MONGO_URI, JWT_SECRET, etc.)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();

// --- Security & convenience middleware ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allow the login cookie to be sent/received
  })
);

app.use(express.json()); // read JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // log each request to the terminal

// Basic protection against too many requests from one IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Serve uploaded product images (only used when Cloudinary isn't configured)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "HYPE API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Must be the LAST app.use() — catches errors from any route above
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`HYPE API running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
