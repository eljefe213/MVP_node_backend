import { sequelize } from '../config/database.js';
import User from './User.js';
import Mission from './Mission.js';
import Inscription from './Inscription.js';
import Comment from './Comment.js';
import Event from './Event.js';

// Define relationships
User.hasMany(Mission, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Mission.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasMany(Inscription, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Mission.hasMany(Inscription, {
  foreignKey: 'missionId',
  onDelete: 'CASCADE'
});
Inscription.belongsTo(User, {
  foreignKey: 'userId'
});
Inscription.belongsTo(Mission, {
  foreignKey: 'missionId'
});

User.hasMany(Comment, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Mission.hasMany(Comment, {
  foreignKey: 'missionId',
  onDelete: 'CASCADE'
});
Comment.belongsTo(User, {
  foreignKey: 'userId'
});
Comment.belongsTo(Mission, {
  foreignKey: 'missionId'
});

Mission.hasMany(Event, {
  foreignKey: 'missionId',
  onDelete: 'CASCADE'
});
Event.belongsTo(Mission, {
  foreignKey: 'missionId'
});

// Initialize database
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV === 'test') {
      await sequelize.sync({ force: true });
    } else {
      await sequelize.sync();
    }
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

export { User, Mission, Inscription, Comment, Event, initDatabase };