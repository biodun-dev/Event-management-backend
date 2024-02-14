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
exports.createPermanentAdminUser = void 0;
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
