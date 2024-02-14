"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController"); // Ensure your import paths are correct
const router = express_1.default.Router();
// Existing registration and authentication routes
router.post("/initiate-registration", AuthController_1.initiateRegistration);
router.post("/add-email-request-otp", AuthController_1.addEmailAndRequestOTP);
router.post("/verify-otp-set-password", AuthController_1.verifyOTPAndSetPassword);
router.post("/login", AuthController_1.login);
router.post("/resend-otp", AuthController_1.resendOTP);
router.post("/complete-profile-registration", AuthController_1.completeProfileRegistration);
// New route for fetching Membership ID
// Assuming public access for demonstration; you might want to protect this route with authentication
router.get("/membership-id/:userId", AuthController_1.getMembershipId);
router.post('/change-password', AuthController_1.changePassword);
exports.default = router;
