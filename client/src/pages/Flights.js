import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Flights.css';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/flights');
      setFlights(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить рейсы');
      console.error('Error fetching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = flights.filter(flight =>
    flight.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="flights-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Загрузка рейсов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flights-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="flights-container">
      <div className="flights-header">
        <h1>Доступные космические рейсы</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по направлению..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="flights-grid">
        {filteredFlights.length === 0 ? (
          <div className="no-flights">
            <p>Рейсы не найдены</p>
          </div>
        ) : (
          filteredFlights.map(flight => (
            <div key={flight.id} className="flight-card">
              <div className="flight-image" style={{ backgroundImage: `url(${flight.image_url})` }}>
                <div className="flight-badge">
                  {flight.available_seats > 0 ? (
                    <span className="badge-available">Доступно мест: {flight.available_seats}</span>
                  ) : (
                    <span className="badge-sold-out">Мест нет</span>
                  )}
                </div>
              </div>
              <div className="flight-content">
                <h2 className="flight-destination">{flight.destination}</h2>
                <p className="flight-description">{flight.description}</p>

                <div className="flight-details">
                  <div className="detail-item">
                    <span className="detail-icon">🚀</span>
                    <div>
                      <div className="detail-label">Корабль</div>
                      <div className="detail-value">{flight.spacecraft}</div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <div>
                      <div className="detail-label">Вылет</div>
                      <div className="detail-value">{formatDate(flight.departure_date)}</div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">🔄</span>
                    <div>
                      <div className="detail-label">Возвращение</div>
                      <div className="detail-value">{formatDate(flight.return_date)}</div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <div>
                      <div className="detail-label">Длительность</div>
                      <div className="detail-value">{flight.duration_days} дней</div>
                    </div>
                  </div>
                </div>

                <div className="flight-footer">
                  <div className="flight-price">
                    <span className="price-label">От</span>
                    <span className="price-value">${formatPrice(flight.price)}</span>
                  </div>
                  {flight.available_seats > 0 ? (
                    <Link to={`/book/${flight.id}`} className="btn btn-book">
                      Забронировать
                    </Link>
                  ) : (
                    <button className="btn btn-disabled" disabled>
                      Нет мест
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Flights;
