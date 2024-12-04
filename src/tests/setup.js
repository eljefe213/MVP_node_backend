import { sequelize } from '../config/database.js';
import { User, Mission, Inscription, Comment, Event } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const setupTestDatabase = async () => {
  try {
    // First, ensure we're connected to the database
    await sequelize.authenticate();

    // Drop existing tables if they exist
    try {
      await sequelize.query('DROP TABLE IF EXISTS Comments;');
      await sequelize.query('DROP TABLE IF EXISTS Events;');
      await sequelize.query('DROP TABLE IF EXISTS Inscriptions;');
      await sequelize.query('DROP TABLE IF EXISTS Missions;');
      await sequelize.query('DROP TABLE IF EXISTS Users;');
    } catch (error) {
      console.log('Tables may not exist yet, continuing...');
    }

    // Create tables in correct order
    await User.sync({ force: true });
    await Mission.sync({ force: true });
    await Inscription.sync({ force: true });
    await Comment.sync({ force: true });
    await Event.sync({ force: true });

    // Verify all tables are created
    await sequelize.query('SELECT name FROM sqlite_master WHERE type="table";');

  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

export const clearTestDatabase = async () => {
  try {
    // Drop tables in reverse order to handle foreign key constraints
    await Comment.drop();
    await Event.drop();
    await Inscription.drop();
    await Mission.drop();
    await User.drop();
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error;
  }
};