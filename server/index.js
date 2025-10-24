const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./database');
const flightsRouter = require('./routes/flights');
const bookingsRouter = require('./routes/bookings');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/flights', flightsRouter);
app.use('/api/bookings', bookingsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Cosmic Travel API is running' });
});

// Initialize database and start server
db.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}/api/health to check status`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
