import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utilis/mailer';
import { sendSMS } from '../utilis/smsSender';
import { generateOTP } from '../utilis/generateOTP';

interface IUser {
    _id: string; // Replace with the actual type of your user ID field (e.g., Types.ObjectId)
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    otp: string | null;
    otpExpires: Date | null;
  }
  const initiateRegistration = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
  
    // Basic validation to ensure phoneNumber is provided
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
  
    try {
      let user = await UserModel.findOne({ phoneNumber });
  
      // Check if the phone number is already registered
      if (user) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }
  
      // Create a user with just the phone number
      user = new UserModel({ phoneNumber });
      await user.save();
  
      // Successfully registered the phone number
      res.status(201).json({ message: 'Phone number registered, proceed to enter email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Step 2: Add email to user and request OTP
const addEmailAndRequestOTP = async (req: Request, res: Response) => {
  const { phoneNumber, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    let user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.email) {
      return res.status(400).json({ message: 'Email already added, request OTP directly' });
    }

    // Set the email only if it's provided, otherwise, skip setting it to avoid null values
    user.email = email.trim(); // Ensure we don't just have whitespace

    const otp = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    // Send OTP to both email and phone
    await sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);
    await sendSMS(phoneNumber, `Your OTP is: ${otp}`);
    res.status(200).json({ message: 'OTP sent to your email and phone number.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 3: Verify OTP and allow setting of password
const verifyOTPAndSetPassword = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.status(200).json({ message: 'Password set successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const login = async (req: Request, res: Response) => {
    try {
      const { phoneNumber, password } = req.body;
      const user = await UserModel.findOne({ phoneNumber });
  
      if (!user) {
        // User not found
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Use an assertion to tell TypeScript that user is not undefined
      const userWithPassword = user as IUser;
  
      // Check if password matches, only if user is found
      const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);
      
      if (!isPasswordValid) {
        // Invalid password
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: userWithPassword._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  


  const resendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found.' });
      }
  
      // Check if the OTP has expired (optional, depends on your business logic)
      if (user.otpExpires && user.otpExpires < new Date()) {
        return res.status(400).json({ message: 'OTP has expired.' });
      }
  
      // Generate a new OTP and update the expiration time
      const otp = generateOTP();
      const otpExpires = new Date();
      otpExpires.setMinutes(otpExpires.getMinutes() + 10); // Set OTP expiration time
  
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
  
      // Resend OTP to email and phone
      await sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);
      // Assuming you have the phone number associated with the user
      await sendSMS(user.phoneNumber, `Your OTP is: ${otp}`);
  
      res.status(200).json({ message: 'OTP resent to your email and phone number.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  // Step 4: Complete Profile Registration
  const completeProfileRegistration = async (req: Request, res: Response) => {
    const { phoneNumber, firstName, lastName, nccCentre, sex, dob } = req.body; // Include sex and dob
    try {
      let user = await UserModel.findOne({ phoneNumber });
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
      user.sex = sex; // Update sex
      user.dob = dob; // Update dob
      user.registrationComplete = true;
      await user.save();
      
      res.status(200).json({ message: 'Profile registration complete.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};



  
export {  login, resendOTP, initiateRegistration, addEmailAndRequestOTP, verifyOTPAndSetPassword,completeProfileRegistration };
