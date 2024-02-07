import express from 'express';
import authenticateToken from '../middleware/authenticateToken';

import {
  initiateRegistration,
  addEmailAndRequestOTP,
  verifyOTPAndSetPassword,login,resendOTP,
  completeProfileRegistration 
} from '../controllers/AuthController'; // Adjusted import to match the new function names

const router = express.Router();

// Step 1: Initiate registration with phone number
router.post('/initiate-registration', initiateRegistration);

// Step 2: Add email and request OTP (assuming user is identified via some form of temporary token or session)
router.post('/add-email-request-otp', addEmailAndRequestOTP);

// Step 3: Verify OTP and set password (this could also be protected, depending on how you manage sessions or temporary tokens)
router.post('/verify-otp-set-password', verifyOTPAndSetPassword);

// Assuming you have a login route for after the user has completed registration
router.post('/login',authenticateToken, login);

// Assuming the verifyOTP and resendOTP functions are part of the registration or account recovery process
// and adjusting their usage according to the new process if needed
// Example protected route to resend OTP if the first one expires, requires authentication
router.post('/resend-otp', resendOTP);
router.post('/complete-profile-registration', completeProfileRegistration);

export default router;


