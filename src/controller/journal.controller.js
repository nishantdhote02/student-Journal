const JournalModel = require("../model/journal.model");

const createJournal = async (req, res) => {
  try {
    const { topic, description, duration, difficulty } = req.body;

    const journal = await JournalModel.create({
      userId: req.user._id,
      topic,
      description,
      duration,
      difficulty,
    });

    res.status(201).json({
      message: "Journal created",
      journal,
    });
  } catch (error) {
    console.log("Error in createJournal:", error);
    res.status(500).json({
      message: "Error creating journal",
      error: error.message,
    });
  }
};

const getAllJournal = async (req, res) => {
  try {
    const journals = await JournalModel.find({
      userId: req.user._id,
    });

    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching journals",
      error: error.message,
    });
  }
};

const getSingleJournal = async (req, res) => {
  try {
    const journal = await JournalModel.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({
        message: "Journal not found",
      });
    }

    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching journal",
      error: error.message,
    });
  }
};

const updateJournal = async (req, res) => {
  try {
    const { topic, description, duration, difficulty } = req.body;

    const journal = await JournalModel.findByIdAndUpdate(
      req.params.id,
      {
        userId: req.user._id,
        topic,
        description,
        duration,
        difficulty,
      },
      { new: true },
    );

    if (!journal) {
      return res.status(404).json({
        message: "Journal not found",
      });
    }

    res.status(200).json({
      message: "Journal updated",
      journal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating journal",
      error: error.message,
    });
  }
};
const deleteJournal = async (req, res) => {
  try {
    const journal = await JournalModel.findByIdAndDelete(req.params.id);

    if (!journal) {
      return res.status(404).json({
        message: "Journal not found",
      });
    }

    res.status(200).json({
      message: "Journal deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting journal",
      error: error.message,
    });
  }
};

module.exports = {
  createJournal,
  getAllJournal,
  getSingleJournal,
  updateJournal,
  deleteJournal,
};
