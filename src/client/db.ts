import Database from 'better-sqlite3';
import * as path from 'path';

const dbPath = path.join(__dirname, '../../reservations.db');
const db = new Database(dbPath);

export function getAllReservations() {
  return db.prepare('SELECT * FROM reservations ORDER BY reservation_date, start_time').all();
}

export function getReservationById(id: any) {
  return db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
}

export function getReservationsForDate(date: string) {
  return db.prepare('SELECT * FROM reservations WHERE DATE(reservation_time) = ? AND status != ?')
    .all(date, 'CANCELLED');
}

export function createReservation(data: any) {
  const result = db.prepare(
    'INSERT INTO reservations (customer_id, party_size, reservation_time, duration_minutes) VALUES (?, ?, ?, ?)'
  ).run(
    data.customer_id,
    data.party_size,
    data.reservation_time,
    data.duration_minutes || 90
  );
  
  return getReservationById(result.lastInsertRowid);
}

export function updateReservationStatus(id: any, status: any) {
  db.prepare(
    'UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(status, id);
  
  return getReservationById(id);
}

export function cancelReservation(id: any) {
  return updateReservationStatus(id, 'CANCELLED');
}

export function close() {
  db.close();
}
