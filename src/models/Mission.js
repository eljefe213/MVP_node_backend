import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Mission = sequelize.define('Mission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  start_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'inProgress', 'completed', 'cancelled', 'archived'),
    defaultValue: 'draft'
  }
});

export default Mission;