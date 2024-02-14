"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLiveEvents = exports.listUpcomingEvents = exports.listCalendarEvents = exports.createEvent = void 0;
const events_1 = __importDefault(require("../models/events"));
const notification_1 = __importDefault(require("../models/notification"));
// import { sendNotification } from '../utilis/notificationServices';
// Other controller methods...
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = new events_1.default(req.body);
        yield event.save();
        // Create a notification document in the database
        const notification = new notification_1.default({
            user: req.body.userId,
            event: event._id,
            message: `Reminder: The event ${event.name} is happening next week!`,
            deviceToken: req.body.deviceToken,
            dateToSend: new Date(), // Immediate sending for this example
        });
        yield notification.save();
        // // Send the notification using the saved document's ID
        // await sendNotification(notification._id.toString());
        return res.status(201).json({ event, notification: 'Notification scheduled.' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating event', error: error.message });
    }
});
exports.createEvent = createEvent;
// Controller to list events for the calendar
const listCalendarEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield events_1.default.find();
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error: error.message });
    }
});
exports.listCalendarEvents = listCalendarEvents;
// Controller to list upcoming events
const listUpcomingEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const upcomingEvents = yield events_1.default.find({ startDate: { $gte: new Date() } }).sort({ startDate: 1 });
        res.status(200).json(upcomingEvents);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving upcoming events', error: error.message });
    }
});
exports.listUpcomingEvents = listUpcomingEvents;
// Controller to get live events
const listLiveEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const liveEvents = yield events_1.default.find({ isLive: true });
        res.status(200).json(liveEvents);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving live events', error: error.message });
    }
});
exports.listLiveEvents = listLiveEvents;
