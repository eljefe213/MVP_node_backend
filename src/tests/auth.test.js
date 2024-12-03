import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { setupTestDatabase, clearTestDatabase } from './setup.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await clearTestDatabase();
  });

  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    skills: 'JavaScript, Node.js',
    availability: 'Weekends'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
  });
});