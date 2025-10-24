import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    passenger_name: '',
    passenger_email: '',
    passenger_phone: '',
    num_passengers: 1
  });

  useEffect(() => {
    fetchFlight();
  }, [flightId]);

  const fetchFlight = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/flights/${flightId}`);
      setFlight(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить информацию о рейсе');
      console.error('Error fetching flight:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.num_passengers > flight.available_seats) {
      setError(`Доступно только ${flight.available_seats} мест`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const bookingData = {
        ...formData,
        flight_id: parseInt(flightId),
        num_passengers: parseInt(formData.num_passengers)
      };

      const response = await axios.post('/api/bookings', bookingData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Не удалось создать бронирование');
      console.error('Error creating booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalPrice = flight ? flight.price * formData.num_passengers : 0;

  if (loading) {
    return (
      <div className="booking-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="booking-container">
        <div className="error">Рейс не найден</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="booking-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Бронирование успешно создано!</h2>
          <p>Перенаправление на страницу бронирований...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1>Бронирование космического путешествия</h1>

        <div className="flight-summary">
          <h2>{flight.destination}</h2>
          <div className="summary-details">
            <div className="summary-item">
              <span className="summary-label">Корабль:</span>
              <span className="summary-value">{flight.spacecraft}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Вылет:</span>
              <span className="summary-value">{formatDate(flight.departure_date)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Возвращение:</span>
              <span className="summary-value">{formatDate(flight.return_date)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Длительность:</span>
              <span className="summary-value">{flight.duration_days} дней</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Доступно мест:</span>
              <span className="summary-value">{flight.available_seats}</span>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="passenger_name">Полное имя</label>
            <input
              type="text"
              id="passenger_name"
              name="passenger_name"
              value={formData.passenger_name}
              onChange={handleChange}
              required
              placeholder="Иван Иванов"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passenger_email">Email</label>
            <input
              type="email"
              id="passenger_email"
              name="passenger_email"
              value={formData.passenger_email}
              onChange={handleChange}
              required
              placeholder="ivan@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="passenger_phone">Телефон</label>
            <input
              type="tel"
              id="passenger_phone"
              name="passenger_phone"
              value={formData.passenger_phone}
              onChange={handleChange}
              required
              placeholder="+7 999 123-45-67"
            />
          </div>

          <div className="form-group">
            <label htmlFor="num_passengers">Количество пассажиров</label>
            <input
              type="number"
              id="num_passengers"
              name="num_passengers"
              value={formData.num_passengers}
              onChange={handleChange}
              min="1"
              max={flight.available_seats}
              required
            />
          </div>

          <div className="total-price">
            <span>Итого:</span>
            <span className="price">${formatPrice(totalPrice)}</span>
          </div>

          <button
            type="submit"
            className="btn btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Обработка...' : 'Забронировать'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
