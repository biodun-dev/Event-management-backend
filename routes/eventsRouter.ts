import express from 'express';
import {
  createEvent,
  listCalendarEvents,
  listUpcomingEvents,
  listLiveEvents
} from '../controllers/eventsController';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();

// Route to create a new event
router.post('/events',authenticateToken, createEvent);

// Route to list all events for the calendar
router.get('/events', authenticateToken,listCalendarEvents);

// Route to list upcoming events
router.get('/events/upcoming', authenticateToken,listUpcomingEvents);

// Route to list live events
router.get('/events/live',authenticateToken, listLiveEvents);

export default router;
