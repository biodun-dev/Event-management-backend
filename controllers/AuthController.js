"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeProfileRegistration = exports.verifyOTPAndSetPassword = exports.addEmailAndRequestOTP = exports.initiateRegistration = exports.resendOTP = exports.login = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../utilis/mailer");
const smsSender_1 = require("../utilis/smsSender");
const generateOTP_1 = require("../utilis/generateOTP");
// Step 1: Save phone number and initiate registration
const initiateRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    try {
        let user = yield UserModel_1.default.findOne({ phoneNumber });
        if (user) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }
        // Create a user with just the phone number
        user = new UserModel_1.default({ phoneNumber });
        yield user.save();
        res.status(201).json({ message: 'Phone number registered, proceed to enter email' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.initiateRegistration = initiateRegistration;
// Step 2: Add email to user and request OTP
const addEmailAndRequestOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, email } = req.body;
    try {
        let user = yield UserModel_1.default.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.email) {
            return res.status(400).json({ message: 'Email already added, request OTP directly' });
        }
        user.email = email;
        const otp = (0, generateOTP_1.generateOTP)();
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 10);
        user.otp = otp;
        user.otpExpires = otpExpires;
        yield user.save();
        // Send OTP to both email and phone
        yield (0, mailer_1.sendEmail)(email, 'Your OTP', `Your OTP is: ${otp}`);
        yield (0, smsSender_1.sendSMS)(phoneNumber, `Your OTP is: ${otp}`);
        res.status(200).json({ message: 'OTP sent to your email and phone number.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addEmailAndRequestOTP = addEmailAndRequestOTP;
// Step 3: Verify OTP and allow setting of password
const verifyOTPAndSetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        yield user.save();
        res.status(200).json({ message: 'Password set successfully, user registration complete.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.verifyOTPAndSetPassword = verifyOTPAndSetPassword;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, password } = req.body;
        const user = yield UserModel_1.default.findOne({ phoneNumber });
        if (!user) {
            // User not found
            return res.status(400).json({ message: 'User not found' });
        }
        // Use an assertion to tell TypeScript that user is not undefined
        const userWithPassword = user;
        // Check if password matches, only if user is found
        const isPasswordValid = yield bcryptjs_1.default.compare(password, userWithPassword.password);
        if (!isPasswordValid) {
            // Invalid password
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: userWithPassword._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        // Check if the OTP has expired (optional, depends on your business logic)
        if (user.otpExpires && user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired.' });
        }
        // Generate a new OTP and update the expiration time
        const otp = (0, generateOTP_1.generateOTP)();
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 10); // Set OTP expiration time
        user.otp = otp;
        user.otpExpires = otpExpires;
        yield user.save();
        // Resend OTP to email and phone
        yield (0, mailer_1.sendEmail)(email, 'Your OTP', `Your OTP is: ${otp}`);
        // Assuming you have the phone number associated with the user
        yield (0, smsSender_1.sendSMS)(user.phoneNumber, `Your OTP is: ${otp}`);
        res.status(200).json({ message: 'OTP resent to your email and phone number.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.resendOTP = resendOTP;
// Step 4: Complete Profile Registration
const completeProfileRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, firstName, lastName, nccCentre } = req.body;
    try {
        let user = yield UserModel_1.default.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.registrationComplete) {
            return res.status(400).json({ message: 'User profile already completed' });
        }
        // Update the user profile with the additional fields
        user.firstName = firstName;
        user.lastName = lastName;
        user.nccCentre = nccCentre;
        user.registrationComplete = true; // Assuming this is the last step of the registration
        yield user.save();
        res.status(200).json({ message: 'Profile registration complete.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.completeProfileRegistration = completeProfileRegistration;
