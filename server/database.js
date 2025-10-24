const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../cosmic-travel.db');
const db = new sqlite3.Database(dbPath);

const initialize = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Создание таблицы космических рейсов
      db.run(`
        CREATE TABLE IF NOT EXISTS flights (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          destination TEXT NOT NULL,
          departure_date TEXT NOT NULL,
          return_date TEXT NOT NULL,
          spacecraft TEXT NOT NULL,
          price REAL NOT NULL,
          available_seats INTEGER NOT NULL,
          duration_days INTEGER NOT NULL,
          description TEXT,
          image_url TEXT
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // Создание таблицы бронирований
      db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          flight_id INTEGER NOT NULL,
          passenger_name TEXT NOT NULL,
          passenger_email TEXT NOT NULL,
          passenger_phone TEXT NOT NULL,
          num_passengers INTEGER NOT NULL,
          total_price REAL NOT NULL,
          booking_date TEXT NOT NULL,
          status TEXT DEFAULT 'confirmed',
          FOREIGN KEY (flight_id) REFERENCES flights(id)
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // Проверка наличия данных
      db.get('SELECT COUNT(*) as count FROM flights', (err, row) => {
        if (err) return reject(err);

        // Добавление начальных данных если таблица пуста
        if (row.count === 0) {
          const stmt = db.prepare(`
            INSERT INTO flights (destination, departure_date, return_date, spacecraft, price, available_seats, duration_days, description, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          const flights = [
            [
              'Международная космическая станция (МКС)',
              '2025-12-01',
              '2025-12-08',
              'SpaceX Dragon',
              250000,
              4,
              7,
              'Незабываемая неделя на орбите Земли с видом на нашу планету. Включает обучение космонавтов и невесомость.',
              'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800'
            ],
            [
              'Луна - Море Спокойствия',
              '2026-03-15',
              '2026-03-29',
              'Blue Origin Lunar Lander',
              1500000,
              6,
              14,
              'Двухнедельная экспедиция на Луну. Прогулки по лунной поверхности, посещение места высадки Аполлона-11.',
              'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800'
            ],
            [
              'Марс - Равнина Утопия',
              '2027-06-01',
              '2027-12-15',
              'Starship Mars',
              5000000,
              12,
              197,
              'Историческая экспедиция на Марс! Полугодовое путешествие включает исследование марсианской поверхности и участие в научных экспериментах.',
              'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800'
            ],
            [
              'Орбитальный отель "Звездный"',
              '2025-11-10',
              '2025-11-13',
              'SpaceX Crew Dragon',
              150000,
              8,
              3,
              'Комфортабельный космический отель на орбите. Панорамные иллюминаторы, ресторан с видом на Землю, spa-процедуры в невесомости.',
              'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800'
            ],
            [
              'Облет Луны',
              '2026-01-20',
              '2026-01-27',
              'SpaceX Starship',
              500000,
              20,
              7,
              'Недельное путешествие с облетом Луны. Увидьте темную сторону Луны и сделайте уникальные фотографии.',
              'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800'
            ],
            [
              'Сатурн - пролет мимо колец',
              '2028-09-01',
              '2029-06-30',
              'Nuclear Propulsion Explorer',
              10000000,
              6,
              303,
              'Уникальная 10-месячная экспедиция к Сатурну. Наблюдение колец вблизи, пролет мимо спутника Титан.',
              'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=800'
            ]
          ];

          flights.forEach(flight => {
            stmt.run(flight);
          });

          stmt.finalize();
        }
        resolve();
      });
    });
  });
};

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = {
  initialize,
  query,
  run,
  get,
  db
};
