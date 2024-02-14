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
exports.getAllRegisteredMembers = exports.getTotalRegisteredMembers = exports.findTopPerformingCenters = exports.findLowestCenter = exports.findHighestCenter = exports.getUserCount = exports.createPermanentAdminUser = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createPermanentAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminEmail = 'admin@example.com'; // Use real admin email
    const adminExists = yield UserModel_1.default.findOne({ email: adminEmail });
    if (adminExists) {
        console.log('Admin user already exists.');
        return;
    }
    const adminPassword = 'SecureAdminPassword'; // Use a secure password
    const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, 10);
    const adminUser = new UserModel_1.default({
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        phoneNumber: '1234567890',
        role: 'admin',
    });
    try {
        yield adminUser.save();
        console.log('Admin user created successfully.');
    }
    catch (error) {
        console.error('Error creating admin user:', error);
    }
});
exports.createPermanentAdminUser = createPermanentAdminUser;
const getUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield UserModel_1.default.countDocuments();
        res.json({ userCount: count });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserCount = getUserCount;
const findHighestCenter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield UserModel_1.default.aggregate([
            { $match: { nccCentre: { $ne: null } } }, // Match documents where nccCentre is not null
            { $group: { _id: '$nccCentre', userCount: { $sum: 1 } } }, // Group by nccCentre and count users
            { $sort: { userCount: -1 } }, // Sort groups by userCount in descending order
            { $limit: 1 } // Limit to the highest center
        ]);
        return result;
    }
    catch (error) {
        console.error('Error finding highest center:', error);
        throw error;
    }
});
exports.findHighestCenter = findHighestCenter;
// Function to find the center with the lowest number of users
const findLowestCenter = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield UserModel_1.default.aggregate([
            { $match: { nccCentre: { $ne: null } } },
            { $group: { _id: '$nccCentre', userCount: { $sum: 1 } } },
            { $sort: { userCount: 1 } }, // Sort groups by userCount in ascending order
            { $limit: 1 } // Limit to the lowest center
        ]);
        return result;
    }
    catch (error) {
        console.error('Error finding lowest center:', error);
        throw error;
    }
});
exports.findLowestCenter = findLowestCenter;
// Function to find the top 5 performing centers
const findTopPerformingCenters = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topCenters = yield UserModel_1.default.aggregate([
            { $match: { nccCentre: { $ne: null } } }, // Match documents where nccCentre is not null
            { $group: { _id: '$nccCentre', userCount: { $sum: 1 } } }, // Group by nccCentre and count users
            { $sort: { userCount: -1 } }, // Sort groups by userCount in descending order
            { $limit: 5 } // Limit to the top 5 centers
        ]);
        return topCenters;
    }
    catch (error) {
        console.error('Error finding top performing centers:', error);
        throw error;
    }
});
exports.findTopPerformingCenters = findTopPerformingCenters;
const getTotalRegisteredMembers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalMembers = yield UserModel_1.default.countDocuments();
        return totalMembers;
    }
    catch (error) {
        console.error('Error fetching total registered members:', error);
        throw error;
    }
});
exports.getTotalRegisteredMembers = getTotalRegisteredMembers;
//Function to get all registered members
const getAllRegisteredMembers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Select only the fields you want to expose, excluding sensitive fields like password
        const members = yield UserModel_1.default.find({}, '-password -otp -otpExpires');
        return members;
    }
    catch (error) {
        console.error('Error fetching registered members:', error);
        throw error;
    }
});
exports.getAllRegisteredMembers = getAllRegisteredMembers;
