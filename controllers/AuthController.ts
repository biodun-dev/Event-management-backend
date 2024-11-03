import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utilis/mailer";
import { sendSMS } from "../utilis/smsSender";
import { generateOTP } from "../utilis/generateOTP";
const io = require("../app");

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  otp: string | null;
  otpExpires: Date | null;
}
const initiateRegistration = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    let user = await UserModel.findOne({ phoneNumber });

    if (user) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    user = new UserModel({ phoneNumber });
    await user.save();

    res
      .status(201)
      .json({ message: "Phone number registered, proceed to enter email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addEmailAndRequestOTP = async (req: Request, res: Response) => {
  const { phoneNumber, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.email) {
      return res
        .status(400)
        .json({ message: "Email already added, request OTP directly" });
    }

    user.email = email.trim();

    const otp = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail(email, "Your OTP", `Your OTP is: ${otp}`);
    await sendSMS(phoneNumber, `Your OTP is: ${otp}`);
    res
      .status(200)
      .json({ message: "OTP sent to your email and phone number." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOTPAndSetPassword = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (
      !user ||
      !user.otpExpires ||
      user.otp !== otp ||
      user.otpExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.status(200).json({ message: "Password set successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password === undefined) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin" && user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Access Denied: Unauthorized role" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    const otp = generateOTP();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail(email, "Your OTP", `Your OTP is: ${otp}`);
    await sendSMS(user.phoneNumber, `Your OTP is: ${otp}`);

    res
      .status(200)
      .json({ message: "OTP resent to your email and phone number." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const completeProfileRegistration = async (req: Request, res: Response) => {
  const { phoneNumber, firstName, lastName, nccCentre, sex, dob } = req.body;
  try {
    let user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.registrationComplete) {
      return res
        .status(400)
        .json({ message: "User profile already completed" });
    }

    const sequenceNumber = (await UserModel.countDocuments()) + 1;
    const sequenceStr = sequenceNumber.toString().padStart(3, "0");

    const centreCode = nccCentre.toLowerCase().replace(/\s+/g, "-");

    const date = new Date();
    const timestamp =
      (date.getMonth() + 1).toString().padStart(2, "0") +
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
    await user.save();

    if (user.registrationComplete) {
      io.emit("profileRegistrationComplete", {
        membershipId: user.membershipId,
      });
      res
        .status(200)
        .json({ message: "Profile registration complete.", membershipId });
    } else {
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMembershipId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user || !user.membershipId) {
      return res
        .status(404)
        .json({ message: "User not found or membership ID not generated" });
    }
    res.status(200).json({ membershipId: user.membershipId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const changePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password === undefined) {
      return res
        .status(400)
        .json({ message: "User does not have a password set" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  login,
  resendOTP,
  initiateRegistration,
  addEmailAndRequestOTP,
  verifyOTPAndSetPassword,
  completeProfileRegistration,
  getMembershipId,
  changePassword,
};
