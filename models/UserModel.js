"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true }, // New field for first name
    lastName: { type: String, required: true }, // New field for last name
    nccCentre: { type: String, required: true }, // New field for NCC Centre
    username: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    registrationComplete: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', UserSchema);
