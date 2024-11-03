import express from "express";
import authenticateToken from "../middleware/authenticateToken";

import {
  initiateRegistration,
  addEmailAndRequestOTP,
  verifyOTPAndSetPassword,
  login,
  resendOTP,
  completeProfileRegistration,
  changePassword,
  getMembershipId,
} from "../controllers/AuthController"; 

const router = express.Router();

router.post("/initiate-registration", initiateRegistration);
router.post("/add-email-request-otp", addEmailAndRequestOTP);
router.post("/verify-otp-set-password", verifyOTPAndSetPassword);
router.post("/login",login);
router.post("/resend-otp", resendOTP);
router.post("/complete-profile-registration", completeProfileRegistration);

router.get("/membership-id/:userId", getMembershipId);
router.post('/change-password',  changePassword);


export default router;
