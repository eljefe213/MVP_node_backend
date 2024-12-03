import { sequelize } from '../config/database.js';

export const setupTestDatabase = async () => {
  await sequelize.sync({ force: true });
};

export const clearTestDatabase = async () => {
  await sequelize.drop();
};