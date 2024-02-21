import UserModel from "../models/UserModel";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { getIo } from "../socket";


export const createPermanentAdminUser = async () => {
  const adminEmail = "admin@example.com"; // Use real admin email
  const adminExists = await UserModel.findOne({ email: adminEmail });

  if (adminExists) {
    console.log("Admin user already exists.");
    return;
  }

  const adminPassword = "SecureAdminPassword"; // Use a secure password
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
    // Get the Socket.IO instance
    const io = getIo();
    // Emit an updated user count to all connected clients
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
      { $match: { nccCentre: { $ne: null } } }, // Match documents where nccCentre is not null
      { $group: { _id: "$nccCentre", userCount: { $sum: 1 } } }, // Group by nccCentre and count users
      { $sort: { userCount: -1 } }, // Sort groups by userCount in descending order
      { $limit: 1 }, // Limit to the highest center
    ]);

    return result;
  } catch (error) {
    console.error("Error finding highest center:", error);
    throw error;
  }
};

// Function to find the center with the lowest number of users
export const findLowestCenter = async () => {
  try {
    const result = await UserModel.aggregate([
      { $match: { nccCentre: { $ne: null } } },
      { $group: { _id: "$nccCentre", userCount: { $sum: 1 } } },
      { $sort: { userCount: 1 } }, // Sort groups by userCount in ascending order
      { $limit: 1 }, // Limit to the lowest center
    ]);

    return result;
  } catch (error) {
    console.error("Error finding lowest center:", error);
    throw error;
  }
};

// Function to find the top 5 performing centers
export const findTopPerformingCenters = async () => {
  try {
    const topCenters = await UserModel.aggregate([
      { $match: { nccCentre: { $ne: null } } }, // Match documents where nccCentre is not null
      { $group: { _id: "$nccCentre", userCount: { $sum: 1 } } }, // Group by nccCentre and count users
      { $sort: { userCount: -1 } }, // Sort groups by userCount in descending order
      { $limit: 5 }, // Limit to the top 5 centers
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

//Function to get all registered members
export const getAllRegisteredMembers = async () => {
  try {
    // Select only the fields you want to expose, excluding sensitive fields like password
    const members = await UserModel.find({}, "-password -otp -otpExpires");
    return members;
  } catch (error) {
    console.error("Error fetching registered members:", error);
    throw error;
  }
};
