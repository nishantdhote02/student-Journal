const express = require("express");

const {
  createJournal,
  getAllJournal,
  getSingleJournal,
  updateJournal,
  deleteJournal,
} = require("../controller/journal.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createJournal);
router.get("/all", authMiddleware, getAllJournal);
router.get("/:id", authMiddleware, getSingleJournal);
router.put("/update/:id", authMiddleware, updateJournal);
router.delete("/delete/:id", authMiddleware, deleteJournal);

module.exports = router;