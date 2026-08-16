const router = require("express").Router();
const controller = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router.post("/", protect, controller.create);
router.get("/mine", protect, controller.mine);
router.get("/admin/all", protect, admin, controller.all);
router.patch("/admin/:id/status", protect, admin, controller.status);

module.exports = router;
