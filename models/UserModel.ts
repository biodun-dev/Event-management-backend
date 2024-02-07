import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  firstName: string;  // New field for first name
  lastName: string;   // New field for last name
  nccCentre: string;  // New field for NCC Centre
  username?: string;
  email?: string;
  password?: string;
  phoneNumber: string;
  otp: string | null;
  otpExpires: Date | null;
  registrationComplete?: boolean;
}

const UserSchema = new Schema({
  firstName: { type: String, required: true }, // New field for first name
  lastName: { type: String, required: true },  // New field for last name
  nccCentre: { type: String, required: true }, // New field for NCC Centre
  username: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  registrationComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
