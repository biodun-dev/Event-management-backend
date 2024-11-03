
import { Request, Response } from "express";
import multer from "multer";
import UserModel from "../models/UserModel"


interface MulterRequest extends Request {
    file?: Express.Multer.File; 
  }
  

const upload = multer({
  storage: multer.memoryStorage(),
});

export const uploadProfilePictureToDB = async (req: MulterRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const imgBase64 = req.file.buffer.toString('base64');
  const userId = req.body.userId; 

  try {
    await UserModel.findByIdAndUpdate(userId, { profilePicture: imgBase64 }, { new: true });
    res.json({ message: "Profile picture uploaded successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfilePictureFromDB = async (req: Request, res: Response) => {
    const userId = req.body.userId as string;
  
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }
  
    try {
      const user = await UserModel.findById(userId);
  
      if (!user || !user.profilePicture) {
        return res.status(404).json({ message: "User not found or no profile picture set." });
      }
  
      const imgBase64 = user.profilePicture;
      res.json({ profilePicture: imgBase64 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const uploadMiddleware = upload.single('file');
