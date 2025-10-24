const express = require('express');
const router = express.Router();
const db = require('../database');

// Получить все рейсы
router.get('/', async (req, res) => {
  try {
    const flights = await db.query('SELECT * FROM flights ORDER BY departure_date');
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// Получить рейс по ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await db.get('SELECT * FROM flights WHERE id = ?', [req.params.id]);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flight' });
  }
});

// Поиск рейсов
router.get('/search/:destination', async (req, res) => {
  try {
    const flights = await db.query(
      'SELECT * FROM flights WHERE destination LIKE ? ORDER BY departure_date',
      [`%${req.params.destination}%`]
    );
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

module.exports = router;
