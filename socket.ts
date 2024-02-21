import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import UserModel from "./models/UserModel";
import {
    findHighestCenter,
    findLowestCenter,
    findTopPerformingCenters,
    getTotalRegisteredMembers,
    getAllRegisteredMembers
  } from "./controllers/UserController";

let io: SocketIOServer;

export const initIo = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on('connection', async (socket) => {
        console.log('A user connected');

        // Emit the current user count
        const emitUserCount = async () => {
            try {
                const count = await UserModel.countDocuments();
                socket.emit("updateUserCount", { userCount: count });
            } catch (error) {
                console.error("Failed to fetch user count:", error);
            }
        };

        // Function to emit various aggregated data
        const emitAggregatedData = async () => {
            try {
                // Fetch and emit the highest center
                const highestCenter = await findHighestCenter();
                socket.emit("highestCenter", highestCenter);

                // Fetch and emit the lowest center
                const lowestCenter = await findLowestCenter();
                socket.emit("lowestCenter", lowestCenter);

                // Fetch and emit the top 5 performing centers
                const topCenters = await findTopPerformingCenters();
                socket.emit("topPerformingCenters", topCenters);

                // Fetch and emit the total registered members
                const totalMembers = await getTotalRegisteredMembers();
                socket.emit("totalRegisteredMembers", { totalMembers });

                // Optionally, fetch and emit all registered members
                // Consider the performance impact and necessity of this operation
                 const members = await getAllRegisteredMembers();
                 socket.emit("allRegisteredMembers",{ members});
            } catch (error) {
                console.error("Failed to fetch aggregated data:", error);
            }
        };

        // Emit all data upon connection
        await emitUserCount();
        await emitAggregatedData();

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export const getIo = (): SocketIOServer => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Implement the aggregation functions here, as you've defined them previously
