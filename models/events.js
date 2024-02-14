"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isLive: { type: Boolean, default: false },
    imageUrl: { type: String, required: true },
    registrationLink: { type: String },
});
const EventModel = mongoose_1.default.model('Event', eventSchema);
exports.default = EventModel;
