import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { getIo } from "../socket";

export const createPermanentAdminUser = async () => {
  const adminEmail = "admin@example.com";
  const adminExists = await UserModel.findOne({ email: adminEmail });

  if (adminExists) {
    console.log("Admin user already exists.");
    return;
  }

  const adminPassword = "SecureAdminPassword";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = new UserModel({
    username: "admin",
    email: adminEmail,
    password: hashedPassword,
    phoneNumber: "1234567890",
    role: "admin",
  });

  try {
    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

export const getUserCount = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await UserModel.countDocuments();
    const io = getIo();
    io.emit("updateUserCount", { userCount: count });
    res.json({ userCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const findHighestCenter = async () => {
  try {
    const result = await UserModel.aggregate([
      { $match: { nccCentre: { $ne: null } } },
      { $group: { _id: "$nccCentre", userCount: { $sum: 1 } } },
      { $sort: { userCount: -1 } },
      { $limit: 1 },
    ]);

    return result;
  } catch (error) {
    console.error("Error finding highest center:", error);
    throw error;
  }
};

export const findLowestCenter = async () => {
  try {
    const result = await UserModel.aggregate([
      { $match: { nccCentre: { $ne: null } } },
      { $group: { _id: "$nccCentre", userCount: { $sum: 1 } } },
      { $sort: { userCount: 1 } },
      { $limit: 1 },
    ]);

    return result;
  } catch (error) {
    console.error("Error finding lowest center:", error);
    throw error;
  }
};

export const findTopPerformingCenters = async () => {
  try {
    const topCenters = await UserModel.aggregate([
      { $match: { nccCentre: { $ne: null } } },
      { $group: { _id: "$nccCentre", userCount: { $sum: 1 } } },
      { $sort: { userCount: -1 } },
      { $limit: 5 },
    ]);

    return topCenters;
  } catch (error) {
    console.error("Error finding top performing centers:", error);
    throw error;
  }
};

export const getTotalRegisteredMembers = async () => {
  try {
    const totalMembers = await UserModel.countDocuments();
    return totalMembers;
  } catch (error) {
    console.error("Error fetching total registered members:", error);
    throw error;
  }
};

export const getAllRegisteredMembers = async () => {
  try {
    const members = await UserModel.find({}, "-password -otp -otpExpires");
    return members;
  } catch (error) {
    console.error("Error fetching registered members:", error);
    throw error;
  }
};
