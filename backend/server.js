const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const invoiceRoutes = require('./routes/invoiceRoutes');
const couponRoutes = require('./routes/couponRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/invoice', invoiceRoutes);
app.use('/coupon', couponRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/invoice')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access invoice page at http://localhost:${PORT}/invoice/new`);
});

module.exports = app;

