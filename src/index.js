import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import missionRoutes from './routes/mission.routes.js';
import inscriptionRoutes from './routes/inscription.routes.js';
import commentRoutes from './routes/comment.routes.js';
import eventRoutes from './routes/event.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/events', eventRoutes);

// Database sync and server start
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});