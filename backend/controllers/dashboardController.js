const Record = require('../models/Record');

const getSummary = async (req, res) => {
  try {
    const records = await Record.find({ isDeleted: false });
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};

    records.forEach(record => {
      const amt = Number(record.amount);
      if (record.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpenses += amt;
      }
      if (categoryTotals[record.category]) {
        categoryTotals[record.category] += amt;
      } else {
        categoryTotals[record.category] = amt;
      }
    });

    const netBalance = totalIncome - totalExpenses;
    const recentActivity = await Record.find().sort({ date: -1 }).limit(5);

    // Monthly trends calculation
    const currentYear = new Date().getFullYear();
    const monthlyTrends = await Record.aggregate([
      {
        $match: {
          date: { 
            $gte: new Date(`${currentYear}-01-01`), 
            $lte: new Date(`${currentYear}-12-31`) 
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    res.json({
      totalIncome,
      totalExpenses,
      netBalance,
      categoryTotals,
      recentActivity,
      monthlyTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary };
