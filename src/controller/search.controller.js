const JournalModel = require("../model/journal.model");

const searchJournal = async (req, res) => {
  try {
    const { topic, difficulty, date } = req.query;

    let query = {
      userId: req.user.id,
    };

    if (topic) {
      query.topic = {
        $regex: topic,
        $options: "i",
      };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);

      end.setDate(end.getDate() + 1);

      query.createdAt = {
        $gte: start,
        $lt: end,
      };
    }

    const journals = await JournalModel.find(query);

    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({
      message: "Error searching journals",
      error: error.message,
    });
  }
};

module.exports = {
  searchJournal,
};