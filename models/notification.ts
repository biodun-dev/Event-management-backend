import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  message: string;
  sent: boolean;
  deviceToken: string;
  dateToSend: Date;
}

const notificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  message: { type: String, required: true },
  sent: { type: Boolean, default: false },
  deviceToken: { type: String, required: true },
  dateToSend: { type: Date, required: true },
}, { timestamps: true });

const NotificationModel = mongoose.model<INotification>('Notification', notificationSchema);

export default NotificationModel;
