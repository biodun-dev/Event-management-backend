import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  nccCentre?: string;
  username?: string;
  email?: string;
  password?: string;
  phoneNumber: string;
  otp: string | null;
  otpExpires: Date | null;
  registrationComplete?: boolean;
}
const UserSchema = new Schema({
  firstName: { type: String }, // Now optional
  lastName: { type: String }, // Now optional
  nccCentre: { type: String }, // Now optional
  username: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  registrationComplete: { type: Boolean, default: false },
}, { timestamps: true });


export default model<IUser>('User', UserSchema);

