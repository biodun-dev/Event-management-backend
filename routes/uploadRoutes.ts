import express from 'express';
import { uploadProfilePictureToDB, uploadMiddleware, getProfilePictureFromDB } from '../controllers/uploadProfile'; // Adjust the import path

const router = express.Router();

// Use the uploadMiddleware for handling file uploads in the profile picture upload route
router.post('/profile-picture', uploadMiddleware, uploadProfilePictureToDB);
router.get('/profile-picture', getProfilePictureFromDB);

export default router;
