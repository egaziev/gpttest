import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить бронирования');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }

    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      alert('Не удалось отменить бронирование');
      console.error('Error cancelling booking:', err);
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка бронирований...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h1>Мои бронирования</h1>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">📋</div>
          <h2>У вас пока нет бронирований</h2>
          <p>Начните свое космическое путешествие прямо сейчас!</p>
          <a href="/flights" className="btn btn-primary">
            Просмотреть рейсы
          </a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-id">Бронирование #{booking.id}</div>
                <div className={`booking-status status-${booking.status}`}>
                  {booking.status === 'confirmed' ? 'Подтверждено' : booking.status}
                </div>
              </div>

              <div className="booking-content">
                <div className="booking-main">
                  <h2>{booking.destination}</h2>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-icon">🚀</span>
                      <div>
                        <div className="detail-label">Корабль</div>
                        <div className="detail-value">{booking.spacecraft}</div>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">📅</span>
                      <div>
                        <div className="detail-label">Дата вылета</div>
                        <div className="detail-value">{formatDate(booking.departure_date)}</div>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">👤</span>
                      <div>
                        <div className="detail-label">Пассажир</div>
                        <div className="detail-value">{booking.passenger_name}</div>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">📧</span>
                      <div>
                        <div className="detail-label">Email</div>
                        <div className="detail-value">{booking.passenger_email}</div>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">📱</span>
                      <div>
                        <div className="detail-label">Телефон</div>
                        <div className="detail-value">{booking.passenger_phone}</div>
                      </div>
                    </div>

                    <div className="detail-row">
                      <span className="detail-icon">👥</span>
                      <div>
                        <div className="detail-label">Количество пассажиров</div>
                        <div className="detail-value">{booking.num_passengers}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-sidebar">
                  <div className="booking-price">
                    <div className="price-label">Общая стоимость</div>
                    <div className="price-value">${formatPrice(booking.total_price)}</div>
                  </div>

                  <div className="booking-date">
                    <div className="date-label">Дата бронирования</div>
                    <div className="date-value">{formatDateTime(booking.booking_date)}</div>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="btn btn-cancel"
                  >
                    Отменить бронирование
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
