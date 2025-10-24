const express = require('express');
const router = express.Router();
const db = require('../database');

// Создать бронирование
router.post('/', async (req, res) => {
  try {
    const { flight_id, passenger_name, passenger_email, passenger_phone, num_passengers } = req.body;

    // Проверить наличие мест
    const flight = await db.get('SELECT * FROM flights WHERE id = ?', [flight_id]);

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    if (flight.available_seats < num_passengers) {
      return res.status(400).json({ error: 'Not enough available seats' });
    }

    // Создать бронирование
    const total_price = flight.price * num_passengers;
    const booking_date = new Date().toISOString();

    const result = await db.run(
      `INSERT INTO bookings (flight_id, passenger_name, passenger_email, passenger_phone, num_passengers, total_price, booking_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [flight_id, passenger_name, passenger_email, passenger_phone, num_passengers, total_price, booking_date]
    );

    // Обновить количество доступных мест
    await db.run(
      'UPDATE flights SET available_seats = available_seats - ? WHERE id = ?',
      [num_passengers, flight_id]
    );

    res.status(201).json({
      id: result.lastID,
      message: 'Booking created successfully',
      booking_id: result.lastID,
      total_price
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Получить все бронирования
router.get('/', async (req, res) => {
  try {
    const bookings = await db.query(`
      SELECT b.*, f.destination, f.departure_date, f.spacecraft
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      ORDER BY b.booking_date DESC
    `);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Получить бронирование по ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await db.get(`
      SELECT b.*, f.destination, f.departure_date, f.return_date, f.spacecraft
      FROM bookings b
      JOIN flights f ON b.flight_id = f.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Отменить бронирование
router.delete('/:id', async (req, res) => {
  try {
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', [req.params.id]);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Вернуть места
    await db.run(
      'UPDATE flights SET available_seats = available_seats + ? WHERE id = ?',
      [booking.num_passengers, booking.flight_id]
    );

    // Удалить бронирование
    await db.run('DELETE FROM bookings WHERE id = ?', [req.params.id]);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
