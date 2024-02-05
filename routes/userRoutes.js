"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = __importDefault(require("../middleware/authenticateToken"));
const AuthController_1 = require("../controllers/AuthController"); // Adjusted import to match the new function names
const router = express_1.default.Router();
// Step 1: Initiate registration with phone number
router.post('/initiate-registration', AuthController_1.initiateRegistration);
// Step 2: Add email and request OTP (assuming user is identified via some form of temporary token or session)
router.post('/add-email-request-otp', AuthController_1.addEmailAndRequestOTP);
// Step 3: Verify OTP and set password (this could also be protected, depending on how you manage sessions or temporary tokens)
router.post('/verify-otp-set-password', AuthController_1.verifyOTPAndSetPassword);
// Assuming you have a login route for after the user has completed registration
router.post('/login', AuthController_1.login);
// Assuming the verifyOTP and resendOTP functions are part of the registration or account recovery process
// and adjusting their usage according to the new process if needed
// Example protected route to resend OTP if the first one expires, requires authentication
router.post('/resend-otp', authenticateToken_1.default, AuthController_1.resendOTP);
exports.default = router;
