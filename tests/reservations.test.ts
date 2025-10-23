import request from 'supertest';
import app from '../src/index';
import Database from 'better-sqlite3';
import * as path from 'path';

describe('Reservation API', () => {
  
  beforeEach(() => {
    const dbPath = path.join(__dirname, '../reservations.db');
    const db = new Database(dbPath);
    db.exec('DELETE FROM reservations');
    db.close();
  });
  
  test('should create a reservation', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .set('Authorization', 'Bearer test-token')
      .send({
        customer_id: 100,
        party_size: 4,
        reservation_time: '2025-12-31T19:00:00Z',
        duration_minutes: 90
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.customer_id).toBe(100);
    expect(response.body.party_size).toBe(4);
  });

  test('should get all reservations', async () => {
    const response = await request(app).get('/api/reservations');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should check availability for a date', async () => {
    const response = await request(app)
      .get('/api/availability')
      .set('Authorization', 'Bearer test-token')
      .query({
        reservation_time: '2025-12-31T20:00:00Z',
        duration: 90
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('available');
    expect(response.body).toHaveProperty('nearby_reservations');
  });

  test('should update reservation status', async () => {
    const createRes = await request(app)
      .post('/api/reservations')
      .set('Authorization', 'Bearer test-token')
      .send({
        customer_id: 200,
        party_size: 2,
        reservation_time: '2026-01-15T18:00:00Z'
      });
    
    const id = createRes.body.id;
    
    const response = await request(app)
      .put(`/api/reservations/${id}/status`)
      .set('Authorization', 'Bearer test-token')
      .send({ status: 'SEATED' });
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('SEATED');
  });

  test('should cancel a reservation', async () => {
    const createRes = await request(app)
      .post('/api/reservations')
      .set('Authorization', 'Bearer test-token')
      .send({
        customer_id: 300,
        party_size: 6,
        reservation_time: '2026-02-20T17:00:00Z'
      });
    
    const id = createRes.body.id;
    
    const response = await request(app)
      .delete(`/api/reservations/${id}`)
      .set('Authorization', 'Bearer test-token');
    
    expect(response.status).toBe(204);
  });
});

