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
  sex?: string; // Existing field for sex
  dob?: Date; // Existing field for date of birth
  membershipId?: string; // New field for membership ID
  role?: string;
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
  membershipId: { type: String, default: null }, // New field for membership ID
  role: { type: String, default: 'user' }, // Possible values: 'user', 'admin'
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
