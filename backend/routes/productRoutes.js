const router = require("express").Router();
const controller = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// --- Public routes (no login needed) ---
router.get("/categories", controller.categories);
router.get("/", controller.list);
router.get("/:id", controller.one);

// --- Admin-only routes ---
router.post("/", protect, admin, upload.single("image"), controller.create);
router.put("/:id", protect, admin, upload.single("image"), controller.update);
router.delete("/:id", protect, admin, controller.remove);

module.exports = router;
