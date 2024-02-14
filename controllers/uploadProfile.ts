
import { Request, Response } from "express";
import multer from "multer";
import UserModel from "../models/UserModel";//Adjust the import path as necessary

// Define a Multer request interface to extend Express's Request
interface MulterRequest extends Request {
    file?: Express.Multer.File; // Making file optional
  }
  

// Set up multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
});

// Function to upload profile picture and store it as a base64 string in the database
export const uploadProfilePictureToDB = async (req: MulterRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Convert the uploaded file to a base64 string
  const imgBase64 = req.file.buffer.toString('base64');
  const userId = req.body.userId; // Ensure you validate and sanitize this input

  try {
    // Update the user document with the base64 image string
    await UserModel.findByIdAndUpdate(userId, { profilePicture: imgBase64 }, { new: true });
    res.json({ message: "Profile picture uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfilePictureFromDB = async (req: Request, res: Response) => {
    const userId = req.body.userId as string; // Assuming the user ID is passed as a query parameter. Validate and sanitize this input.
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
  
    try {
      const user = await UserModel.findById(userId);
  
      if (!user || !user.profilePicture) {
        return res.status(404).json({ message: "User not found or no profile picture set." });
      }
  
      // Assuming 'profilePicture' field contains the base64 string of the image
      const imgBase64 = user.profilePicture;
      res.json({ profilePicture: imgBase64 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

// Multer middleware for single file upload, named 'file'
export const uploadMiddleware = upload.single('file');
