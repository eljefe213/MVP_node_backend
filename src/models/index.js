import { sequelize } from '../config/database.js';
import User from './User.js';
import Mission from './Mission.js';
import Inscription from './Inscription.js';
import Comment from './Comment.js';
import Event from './Event.js';

// Define relationships
Mission.belongsTo(User, { foreignKey: 'userId', as: 'creator' });
User.hasMany(Mission, { foreignKey: 'userId' });

Inscription.belongsTo(User, { foreignKey: 'userId' });
Inscription.belongsTo(Mission, { foreignKey: 'missionId' });
User.hasMany(Inscription, { foreignKey: 'userId' });
Mission.hasMany(Inscription, { foreignKey: 'missionId' });

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Mission, { foreignKey: 'missionId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Mission.hasMany(Comment, { foreignKey: 'missionId' });

Event.belongsTo(Mission, { foreignKey: 'missionId' });
Mission.hasMany(Event, { foreignKey: 'missionId' });

// Initialize database
const initDatabase = async () => {
  try {
    // Remove any existing database file
    await sequelize.sync({ force: true }); // In production, use { force: false }
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

export { User, Mission, Inscription, Comment, Event, initDatabase };