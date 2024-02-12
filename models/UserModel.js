"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)('User', UserSchema);
