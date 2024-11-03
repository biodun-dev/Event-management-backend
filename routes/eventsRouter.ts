import express from 'express';
import {
  createEvent,
  listCalendarEvents,
  listUpcomingEvents,
  listLiveEvents
} from '../controllers/eventsController';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();

router.post('/events',authenticateToken, createEvent);

router.get('/events', authenticateToken,listCalendarEvents);

router.get('/events/upcoming', authenticateToken,listUpcomingEvents);

router.get('/events/live',authenticateToken, listLiveEvents);

export default router;
