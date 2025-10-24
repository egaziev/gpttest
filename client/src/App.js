import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Flights from './pages/Flights';
import BookingForm from './pages/BookingForm';
import Bookings from './pages/Bookings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/book/:flightId" element={<BookingForm />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
