"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = exports.getProfilePictureFromDB = exports.uploadProfilePictureToDB = void 0;
const multer_1 = __importDefault(require("multer"));
const UserModel_1 = __importDefault(require("../models/UserModel")); //Adjust the import path as necessary
// Set up multer for memory storage
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
// Function to upload profile picture and store it as a base64 string in the database
const uploadProfilePictureToDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }
    // Convert the uploaded file to a base64 string
    const imgBase64 = req.file.buffer.toString('base64');
    const userId = req.body.userId; // Ensure you validate and sanitize this input
    try {
        // Update the user document with the base64 image string
        yield UserModel_1.default.findByIdAndUpdate(userId, { profilePicture: imgBase64 }, { new: true });
        res.json({ message: "Profile picture uploaded successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.uploadProfilePictureToDB = uploadProfilePictureToDB;
const getProfilePictureFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId; // Assuming the user ID is passed as a query parameter. Validate and sanitize this input.
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user || !user.profilePicture) {
            return res.status(404).json({ message: "User not found or no profile picture set." });
        }
        // Assuming 'profilePicture' field contains the base64 string of the image
        const imgBase64 = user.profilePicture;
        res.json({ profilePicture: imgBase64 });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getProfilePictureFromDB = getProfilePictureFromDB;
// Multer middleware for single file upload, named 'file'
exports.uploadMiddleware = upload.single('file');
