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
exports.getIo = exports.initIo = void 0;
const socket_io_1 = require("socket.io");
const UserModel_1 = __importDefault(require("./models/UserModel"));
const UserController_1 = require("./controllers/UserController");
let io;
const initIo = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('A user connected');
        // Emit the current user count
        const emitUserCount = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const count = yield UserModel_1.default.countDocuments();
                socket.emit("updateUserCount", { userCount: count });
            }
            catch (error) {
                console.error("Failed to fetch user count:", error);
            }
        });
        // Function to emit various aggregated data
        const emitAggregatedData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Fetch and emit the highest center
                const highestCenter = yield (0, UserController_1.findHighestCenter)();
                socket.emit("highestCenter", highestCenter);
                // Fetch and emit the lowest center
                const lowestCenter = yield (0, UserController_1.findLowestCenter)();
                socket.emit("lowestCenter", lowestCenter);
                // Fetch and emit the top 5 performing centers
                const topCenters = yield (0, UserController_1.findTopPerformingCenters)();
                socket.emit("topPerformingCenters", topCenters);
                // Fetch and emit the total registered members
                const totalMembers = yield (0, UserController_1.getTotalRegisteredMembers)();
                socket.emit("totalRegisteredMembers", { totalMembers });
                // Optionally, fetch and emit all registered members
                // Consider the performance impact and necessity of this operation
                const members = yield (0, UserController_1.getAllRegisteredMembers)();
                socket.emit("allRegisteredMembers", members);
            }
            catch (error) {
                console.error("Failed to fetch aggregated data:", error);
            }
        });
        // Emit all data upon connection
        yield emitUserCount();
        yield emitAggregatedData();
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    }));
};
exports.initIo = initIo;
const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIo = getIo;
// Implement the aggregation functions here, as you've defined them previously
