import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Добро пожаловать в будущее путешествий</h1>
          <p className="hero-subtitle">
            Исследуйте космос с Cosmic Travel - вашим проводником к звездам
          </p>
          <div className="hero-buttons">
            <Link to="/flights" className="btn btn-primary">
              Смотреть рейсы
            </Link>
            <a href="#features" className="btn btn-secondary">
              Узнать больше
            </a>
          </div>
        </div>
        <div className="hero-animation">
          <div className="planet"></div>
          <div className="stars"></div>
        </div>
      </section>

      <section id="features" className="features">
        <h2 className="section-title">Почему выбирают нас</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>МКС и околоземная орбита</h3>
            <p>Проведите неделю на Международной космической станции и насладитесь видом на Землю</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌙</div>
            <h3>Лунные экспедиции</h3>
            <p>Станьте одним из немногих людей, ступивших на поверхность Луны</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🪐</div>
            <h3>Межпланетные путешествия</h3>
            <p>Отправьтесь к Марсу и другим планетам Солнечной системы</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏨</div>
            <h3>Космические отели</h3>
            <p>Комфортабельные орбитальные отели с видом на космос</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍🚀</div>
            <h3>Профессиональная подготовка</h3>
            <p>Полный курс обучения космонавтов перед полетом</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Безопасность превыше всего</h3>
            <p>Используем только проверенные космические корабли и технологии</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Готовы к приключению?</h2>
          <p>Забронируйте свой космический полет уже сегодня</p>
          <Link to="/flights" className="btn btn-large">
            Начать путешествие
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
