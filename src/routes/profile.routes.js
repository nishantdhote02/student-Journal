const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controller/profile.controller");

router.get("/me", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;