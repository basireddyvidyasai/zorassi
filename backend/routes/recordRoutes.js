const express = require('express');
const router = express.Router();
const { createRecord, getRecords, updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect, restrictTo } = require('../middleware/auth');

router.route('/')
  .get(protect, restrictTo('Analyst', 'Admin'), getRecords)
  .post(protect, restrictTo('Admin'), createRecord);

router.route('/:id')
  .put(protect, restrictTo('Admin'), updateRecord)
  .delete(protect, restrictTo('Admin'), deleteRecord);

module.exports = router;
