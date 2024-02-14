import express from 'express';
import {
  createEvent,
  listCalendarEvents,
  listUpcomingEvents,
  listLiveEvents
} from '../controllers/eventsController';

const router = express.Router();

// Route to create a new event
router.post('/events', createEvent);

// Route to list all events for the calendar
router.get('/events', listCalendarEvents);

// Route to list upcoming events
router.get('/events/upcoming', listUpcomingEvents);

// Route to list live events
router.get('/events/live', listLiveEvents);

export default router;
