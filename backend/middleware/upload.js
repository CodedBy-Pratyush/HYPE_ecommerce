const multer = require("multer");

// Keep the uploaded file in memory (as a Buffer) instead of writing it
// to disk automatically — our controller decides where it ends up
// (Cloudinary or the local /uploads folder).
const storage = multer.memoryStorage();

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
