import mongoose from 'mongoose';

interface IEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isLive: boolean;
  imageUrl: string;
  registrationLink?: string;
  name: string;

}

const eventSchema = new mongoose.Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isLive: { type: Boolean, default: false },
  imageUrl: { type: String, required: true },
  registrationLink: { type: String },
});

const EventModel = mongoose.model<IEvent>('Event', eventSchema);

export default EventModel;
