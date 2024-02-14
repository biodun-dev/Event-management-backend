import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventsRouter';
import adminRoutes from './routes/adminRoutes';
import { createPermanentAdminUser } from './controllers/UserController';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/', eventRoutes);
app.use('/api/admin', adminRoutes);

createPermanentAdminUser();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
