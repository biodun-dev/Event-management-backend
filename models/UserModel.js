"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String }, // Removed the required constraint
    email: { type: String, unique: true, sparse: true }, // Made unique but not required; sparse index for optional unique field
    password: { type: String }, // Removed the required constraint
    phoneNumber: { type: String, required: true, unique: true }, // Ensured phone number is unique
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    registrationComplete: { type: Boolean, default: false }, // Track if user has completed all registration steps
}, { timestamps: true }); // Add timestamps for creation and update actions
exports.default = (0, mongoose_1.model)('User', UserSchema);
