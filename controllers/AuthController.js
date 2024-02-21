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
exports.changePassword = exports.getMembershipId = exports.completeProfileRegistration = exports.verifyOTPAndSetPassword = exports.addEmailAndRequestOTP = exports.initiateRegistration = exports.resendOTP = exports.login = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../utilis/mailer");
const smsSender_1 = require("../utilis/smsSender");
const generateOTP_1 = require("../utilis/generateOTP");
const io = require('../app');
const initiateRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    // Basic validation to ensure phoneNumber is provided
    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
    }
    try {
        let user = yield UserModel_1.default.findOne({ phoneNumber });
        // Check if the phone number is already registered
        if (user) {
            return res
                .status(400)
                .json({ message: "Phone number already registered" });
        }
        // Create a user with just the phone number
        user = new UserModel_1.default({ phoneNumber });
        yield user.save();
        // Successfully registered the phone number
        res
            .status(201)
            .json({ message: "Phone number registered, proceed to enter email" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.initiateRegistration = initiateRegistration;
// Step 2: Add email to user and request OTP
const addEmailAndRequestOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        let user = yield UserModel_1.default.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.email) {
            return res
                .status(400)
                .json({ message: "Email already added, request OTP directly" });
        }
        // Set the email only if it's provided, otherwise, skip setting it to avoid null values
        user.email = email.trim(); // Ensure we don't just have whitespace
        const otp = (0, generateOTP_1.generateOTP)();
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 10);
        user.otp = otp;
        user.otpExpires = otpExpires;
        yield user.save();
        // Send OTP to both email and phone
        yield (0, mailer_1.sendEmail)(email, "Your OTP", `Your OTP is: ${otp}`);
        yield (0, smsSender_1.sendSMS)(phoneNumber, `Your OTP is: ${otp}`);
        res
            .status(200)
            .json({ message: "OTP sent to your email and phone number." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addEmailAndRequestOTP = addEmailAndRequestOTP;
// Step 3: Verify OTP and allow setting of password
const verifyOTPAndSetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user ||
            !user.otpExpires ||
            user.otp !== otp ||
            user.otpExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        yield user.save();
        res.status(200).json({ message: "Password set successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.verifyOTPAndSetPassword = verifyOTPAndSetPassword;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            // User not found
            return res.status(400).json({ message: "User not found" });
        }
        // Ensure the user has a password set (it should not be undefined)
        if (user.password === undefined) {
            // This case should technically never occur if your data integrity is good
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Now we can safely assert that `user.password` is a string since we checked it's not undefined
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            // Invalid password
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Assuming the role checking and JWT creation logic remains the same
        if (user.role !== "admin" && user.role !== "user") {
            // If the role is neither 'admin' nor 'user'
            return res
                .status(403)
                .json({ message: "Access Denied: Unauthorized role" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, // Including user role in the token payload
        process.env.JWT_SECRET, { expiresIn: "1h" });
        // Respond with token and possibly user role
        res.json({ token, role: user.role });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.login = login;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        // Check if the OTP has expired (optional, depends on your business logic)
        if (user.otpExpires && user.otpExpires < new Date()) {
            return res.status(400).json({ message: "OTP has expired." });
        }
        // Generate a new OTP and update the expiration time
        const otp = (0, generateOTP_1.generateOTP)();
        const otpExpires = new Date();
        otpExpires.setMinutes(otpExpires.getMinutes() + 10); // Set OTP expiration time
        user.otp = otp;
        user.otpExpires = otpExpires;
        yield user.save();
        // Resend OTP to email and phone
        yield (0, mailer_1.sendEmail)(email, "Your OTP", `Your OTP is: ${otp}`);
        // Assuming you have the phone number associated with the user
        yield (0, smsSender_1.sendSMS)(user.phoneNumber, `Your OTP is: ${otp}`);
        res
            .status(200)
            .json({ message: "OTP resent to your email and phone number." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.resendOTP = resendOTP;
// Step 4: Complete Profile Registration
const completeProfileRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, firstName, lastName, nccCentre, sex, dob } = req.body;
    try {
        let user = yield UserModel_1.default.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.registrationComplete) {
            return res
                .status(400)
                .json({ message: "User profile already completed" });
        }
        // Simulate a unique sequence number for the user.
        const sequenceNumber = (yield UserModel_1.default.countDocuments()) + 1;
        const sequenceStr = sequenceNumber.toString().padStart(3, "0"); // Ensure it is at least three digits
        // Lowercase and replace spaces with dashes for the centre code part, if necessary
        const centreCode = nccCentre.toLowerCase().replace(/\s+/g, "-"); // Assuming 'ilupeju' is the desired format
        const date = new Date();
        // Format the date as MMYYYY for full year representation
        const timestamp = (date.getMonth() + 1).toString().padStart(2, "0") +
            date.getFullYear().toString();
        // Generate membership ID in the format "NCC-XXX-xxxx-YYYYMM"
        const membershipId = `NCC-${sequenceStr}-${centreCode}-${timestamp}`;
        user.firstName = firstName;
        user.lastName = lastName;
        user.nccCentre = nccCentre;
        user.sex = sex;
        user.dob = dob;
        user.registrationComplete = true;
        user.membershipId = membershipId;
        yield user.save();
        if (user.registrationComplete) {
            // Emit an event to all connected clients
            io.emit('profileRegistrationComplete', { membershipId: user.membershipId });
            res.status(200).json({ message: "Profile registration complete.", membershipId });
        }
        else {
            // Handle error or existing user logic
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.completeProfileRegistration = completeProfileRegistration;
// Fetch Membership ID by User ID
const getMembershipId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user || !user.membershipId) {
            return res
                .status(404)
                .json({ message: "User not found or membership ID not generated" });
        }
        res.status(200).json({ membershipId: user.membershipId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getMembershipId = getMembershipId;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, currentPassword, newPassword } = req.body;
    // Basic validation
    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Ensure the user has a password set
        if (user.password === undefined) {
            return res.status(400).json({ message: "User does not have a password set" });
        }
        // Now we can safely pass user.password to bcrypt.compare
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.changePassword = changePassword;
