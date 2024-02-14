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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const UserController_1 = require("../controllers/UserController");
const UserController_2 = require("../controllers/UserController");
const authenticateToken_1 = __importDefault(require("../middleware/authenticateToken"));
// Example admin route
router.get("/all-users", authenticateToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logic to list all users
}));
router.get("/user-count", UserController_1.getUserCount);
// Route for fetching the center with the highest number of users
router.get("/centers/highest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const highestCenter = yield (0, UserController_2.findHighestCenter)();
        if (highestCenter.length > 0) {
            res.json({ success: true, highestCenter: highestCenter[0] });
        }
        else {
            res.json({ success: false, message: "No centers found" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching highest center:", error.message);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message,
            });
        }
        else {
            console.error("Error fetching highest center:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
}));
// Route for fetching the center with the lowest number of users
router.get("/centers/lowest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lowestCenter = yield (0, UserController_2.findLowestCenter)();
        if (lowestCenter.length > 0) {
            res.json({ success: true, lowestCenter: lowestCenter[0] });
        }
        else {
            res.json({ success: false, message: "No centers found" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching lowest center:", error.message);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message,
            });
        }
        else {
            console.error("Error fetching lowest center:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
}));
router.get("/centers/top-performing", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topCenters = yield (0, UserController_2.findTopPerformingCenters)();
        res.json({ success: true, topCenters });
    }
    catch (error) {
        // Perform a type check to narrow down the error to an instance of Error
        if (error instanceof Error) {
            console.error("Error fetching top performing centers:", error.message);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message,
            });
        }
        else {
            // Handle cases where the error might not be an instance of Error
            console.error("Error fetching top performing centers:", error);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: "An unknown error occurred",
            });
        }
    }
}));
router.get('/members/total', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalMembers = yield (0, UserController_2.getTotalRegisteredMembers)();
        res.json({ success: true, totalMembers });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching total registered members:', error.message);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        else {
            console.error('Error fetching total registered members:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}));
router.get('/members/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield (0, UserController_2.getAllRegisteredMembers)();
        res.json({ success: true, members });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching registered members:', error.message);
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        else {
            // Handle any other types of errors
            console.error('Error fetching registered members:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}));
exports.default = router;
