"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventsController_1 = require("../controllers/eventsController");
const router = express_1.default.Router();
// Route to create a new event
router.post('/events', eventsController_1.createEvent);
// Route to list all events for the calendar
router.get('/events', eventsController_1.listCalendarEvents);
// Route to list upcoming events
router.get('/events/upcoming', eventsController_1.listUpcomingEvents);
// Route to list live events
router.get('/events/live', eventsController_1.listLiveEvents);
exports.default = router;
