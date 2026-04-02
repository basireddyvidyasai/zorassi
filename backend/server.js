const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error' });
});

if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      app.listen(process.env.PORT || 5000, () => {
        console.log('Started');
      });
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  mongoose.connect(process.env.MONGODB_URI);
}

module.exports = app;
