import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Inscription = sequelize.define('Inscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  hours: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Inscription;