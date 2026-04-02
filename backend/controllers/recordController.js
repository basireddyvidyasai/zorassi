const Record = require('../models/Record');

const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    if (!amount || !type || !category || !date) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const record = await Record.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user.id
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecords = async (req, res) => {
  try {
    const { type, category, search, startDate, endDate, page = 1, limit = 10, sort = 'desc' } = req.query;
    const query = { isDeleted: false };
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.notes = { $regex: search, $options: 'i' };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const skip = (page - 1) * limit;
    const sortOrder = sort === 'asc' ? 1 : -1;
    const records = await Record.find(query)
      .sort({ date: sortOrder, createdAt: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Record.countDocuments(query);
    res.json({ records, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, isDeleted: false });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    const updatedRecord = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    record.isDeleted = true;
    await record.save();
    res.json({ message: 'Record moved to trash' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };
