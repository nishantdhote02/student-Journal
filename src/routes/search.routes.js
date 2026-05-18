const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  searchJournal,
} = require("../controller/search.controller");

router.get("/", authMiddleware, searchJournal);

module.exports = router;