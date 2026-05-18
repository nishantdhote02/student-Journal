const JournalModel = require("../model/journal.model");

const dashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalEntries = await JournalModel.countDocuments({ userId });

    const totalHoursData = await JournalModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $group: {
          _id: null,
          totalHours: {
            $sum: "$duration",
          },
        },
      },
    ]);

    const recentTopics = await JournalModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("topic difficulty duration");

    res.status(200).json({
      totalEntries,
      totalHours: totalHoursData[0]?.totalHours || 0,
      recentTopics,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

module.exports = {
  dashboardStats,
};