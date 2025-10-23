-- Create reservations table
-- NOTE: Missing indexes on reservation_time which we query by!
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  party_size INTEGER NOT NULL,
  reservation_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 90,
  status TEXT DEFAULT 'CONFIRMED' CHECK(status IN ('CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

