import app from './app.js';
import { config } from './config/index.js';
import { initDatabase } from './models/index.js';

const PORT = config.port || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();