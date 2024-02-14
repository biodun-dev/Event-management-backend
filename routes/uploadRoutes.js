"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadProfile_1 = require("../controllers/uploadProfile"); // Adjust the import path
const router = express_1.default.Router();
// Use the uploadMiddleware for handling file uploads in the profile picture upload route
router.post('/profile-picture', uploadProfile_1.uploadMiddleware, uploadProfile_1.uploadProfilePictureToDB);
router.get('/profile-picture', uploadProfile_1.getProfilePictureFromDB);
exports.default = router;
