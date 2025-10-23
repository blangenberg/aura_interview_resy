import { Router } from 'express';
import * as dbClient from '../client/db';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/reservations', (req, res) => {
  const date = req.query.date as string;
  
  try {
    if (date) {
      const reservations = dbClient.getReservationsForDate(date);
      res.json(reservations);
    } else {
      const reservations = dbClient.getAllReservations();
      res.json(reservations);
    }
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Failed to get reservations' });
  }
});

router.get('/availability', authenticate, (req, res) => {
  const reservationTime = req.query.reservation_time as string;
  const duration = parseInt(req.query.duration as string) || 90;
  
  try {
    const date = reservationTime.split('T')[0];
    const reservations: any = dbClient.getReservationsForDate(date);
    
    const requestedStart = new Date(reservationTime);
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);
    
    let available = true;
    for (const res of reservations) {
      const existingStart = new Date(res.reservation_time);
      const existingEnd = new Date(existingStart.getTime() + res.duration_minutes * 60000);
      
      if (requestedStart < existingEnd && requestedEnd > existingStart) {
        available = false;
        break;
      }
    }
    
    const twoHoursBefore = new Date(requestedStart.getTime() - 2 * 60 * 60000);
    const twoHoursAfter = new Date(requestedStart.getTime() + 2 * 60 * 60000);
    
    const nearbyReservations = reservations.filter((res: any) => {
      const resStart = new Date(res.reservation_time);
      return resStart >= twoHoursBefore && resStart <= twoHoursAfter;
    });
    
    res.json({ 
      available, 
      reservation_time: reservationTime,
      duration,
      nearby_reservations: nearbyReservations
    });
  } catch (err) {
    console.log('Error checking availability:', err);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

router.post('/reservations', authenticate, (req, res) => {
  const data = req.body;
  
  try {
    const date = data.reservation_time.split('T')[0];
    const existing: any = dbClient.getReservationsForDate(date);
    
    const requestedStart = new Date(data.reservation_time);
    const requestedEnd = new Date(requestedStart.getTime() + (data.duration_minutes || 90) * 60000);
    
    for (const reservation of existing) {
      const existingStart = new Date(reservation.reservation_time);
      const existingEnd = new Date(existingStart.getTime() + reservation.duration_minutes * 60000);
      
      if (requestedStart < existingEnd && requestedEnd > existingStart) {
        res.status(409).json({ error: 'Time slot not available' });
        return;
      }
    }
    
    const reservation = dbClient.createReservation(data);
    res.status(201).json(reservation);
  } catch (err) {
    console.log('Error creating reservation:', err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

router.put('/reservations/:id/status', authenticate, (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  
  try {
    const updated = dbClient.updateReservationStatus(id, status);
    res.json(updated);
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.delete('/reservations/:id', authenticate, (req, res) => {
  const id = req.params.id;
  
  try {
    dbClient.cancelReservation(id);
    res.status(204).send();
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

export default router;

