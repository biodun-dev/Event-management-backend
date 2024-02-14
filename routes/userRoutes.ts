import express from "express";
import authenticateToken from "../middleware/authenticateToken";

import {
  initiateRegistration,
  addEmailAndRequestOTP,
  verifyOTPAndSetPassword,
  login,
  resendOTP,
  completeProfileRegistration,
  getMembershipId, // Make sure to import the new function
} from "../controllers/AuthController"; // Ensure your import paths are correct

const router = express.Router();

// Existing registration and authentication routes
router.post("/initiate-registration", initiateRegistration);
router.post("/add-email-request-otp", addEmailAndRequestOTP);
router.post("/verify-otp-set-password", verifyOTPAndSetPassword);
router.post("/login", login);
router.post("/resend-otp", resendOTP);
router.post("/complete-profile-registration", completeProfileRegistration);

// New route for fetching Membership ID
// Assuming public access for demonstration; you might want to protect this route with authentication
router.get("/membership-id/:userId", getMembershipId);

export default router;
