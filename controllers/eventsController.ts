import { Request, Response } from 'express';
import EventModel from '../models/events';
import NotificationModel from '../models/notification';
// import { sendNotification } from '../utilis/notificationServices';

// Other controller methods...
const createEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Assuming the middleware adds a user object to the req
    // Make sure your user object has an _id or equivalent property
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User information is missing from the request' });
    }

    const event = new EventModel({
      ...req.body,
      userId: req.user.id // Use the userId from the authenticated user
    });

    await event.save();

    // Create a notification document in the database
    const notification = new NotificationModel({
      user: req.user.id, // Use the userId from the authenticated user
      event: event.id,
      message: `Reminder: The event ${event.name} is happening next week!`,
      deviceToken: req.body.deviceToken, // Assuming you still get this from the request body
      dateToSend: new Date(), // Immediate sending for this example
    });

    await notification.save();

    return res.status(201).json({ event, notification: 'Notification scheduled.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating event', error: (error as Error).message });
  }
};




// Controller to list events for the calendar
const listCalendarEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventModel.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events',error: (error as Error).message });
  }
};

// Controller to list upcoming events
const listUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const upcomingEvents = await EventModel.find({ startDate: { $gte: new Date() } }).sort({ startDate: 1 });
    res.status(200).json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving upcoming events', error: (error as Error).message });
  }
};

// Controller to get live events
const listLiveEvents = async (req: Request, res: Response) => {
  try {
    const liveEvents = await EventModel.find({ isLive: true });
    res.status(200).json(liveEvents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving live events', error: (error as Error).message });
  }
};

export { createEvent, listCalendarEvents, listUpcomingEvents, listLiveEvents };
