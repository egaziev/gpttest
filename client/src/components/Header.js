import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">Cosmic Travel</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/flights" className="nav-link">Рейсы</Link>
          <Link to="/bookings" className="nav-link">Мои бронирования</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
