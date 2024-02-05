import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  username?: string; // Optional if username is not required at initial registration
  email?: string; // Make email optional as it will be added later
  password?: string; // Make password optional as it will be set at the end of the registration process
  phoneNumber: string; // Required from the start
  otp: string | null;
  otpExpires: Date | null;
  registrationComplete?: boolean; // Optional field to track if registration is complete
}

const UserSchema = new Schema({
  username: { type: String }, // Removed the required constraint
  email: { type: String, unique: true, sparse: true }, // Made unique but not required; sparse index for optional unique field
  password: { type: String }, // Removed the required constraint
  phoneNumber: { type: String, required: true, unique: true }, // Ensured phone number is unique
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  registrationComplete: { type: Boolean, default: false }, // Track if user has completed all registration steps
}, { timestamps: true }); // Add timestamps for creation and update actions

export default model<IUser>('User', UserSchema);
