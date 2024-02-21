import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventsRouter';
import adminRoutes from './routes/adminRoutes';
import uploadProfile from './routes/uploadRoutes';
import { createPermanentAdminUser } from './controllers/UserController';
import http = require('http');
import { initIo } from './socket';

dotenv.config();
connectDB();


const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
initIo(server);

app.use(express.json());

app.use('/api/users', userRoutes,uploadProfile);
app.use('/api/', eventRoutes);
app.use('/api/admin', adminRoutes);

createPermanentAdminUser();


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
