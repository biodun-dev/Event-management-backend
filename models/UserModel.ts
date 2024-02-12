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
  sex?: string; // Added field for sex
  dob?: Date; // Added field for date of birth
}

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  nccCentre: { type: String },
  username: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  registrationComplete: { type: Boolean, default: false },
  sex: { type: String }, // Field for sex
  dob: { type: Date }, // Field for date of birth
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
