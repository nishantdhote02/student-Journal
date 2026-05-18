const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  dashboardStats,
} = require("../controller/dashboard.controller");

router.get("/stats", authMiddleware, dashboardStats);

module.exports = router;