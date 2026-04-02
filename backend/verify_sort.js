const mongoose = require('mongoose');
const Record = require('./models/Record');
require('dotenv').config();

async function checkSort() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const asc = await Record.find({ isDeleted: false }).sort({ date: 1 }).limit(5);
    console.log('\nASCENDING (Oldest First):');
    asc.forEach(r => console.log(`${r.date.toISOString()} - ${r.notes}`));

    const desc = await Record.find({ isDeleted: false }).sort({ date: -1 }).limit(5);
    console.log('\nDESCENDING (Newest First):');
    desc.forEach(r => console.log(`${r.date.toISOString()} - ${r.notes}`));

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSort();
