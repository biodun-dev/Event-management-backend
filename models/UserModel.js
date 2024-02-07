"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)('User', UserSchema);
