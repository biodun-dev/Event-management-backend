import express from 'express';
import { uploadProfilePictureToDB, uploadMiddleware, getProfilePictureFromDB } from '../controllers/uploadProfile';

const router = express.Router();

router.post('/profile-picture', uploadMiddleware, uploadProfilePictureToDB);
router.get('/profile-picture', getProfilePictureFromDB);

export default router;
