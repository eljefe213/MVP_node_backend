import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { setupTestDatabase, clearTestDatabase } from './setup.js';
import { Mission } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

describe('Mission Endpoints', () => {
  let authToken;
  let userId;
  let missionId;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Register and login a test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'missiontester',
        email: 'mission@test.com',
        password: 'password123',
        skills: 'Testing',
        availability: 'Always'
      });

    authToken = registerRes.body.token;
    userId = jwt.verify(authToken, config.jwtSecret).id;
  });

  afterAll(async () => {
    await clearTestDatabase();
  });

  const testMission = {
    title: 'Test Mission',
    description: 'Test Description',
    location: 'Test Location',
    start_date: '2024-04-01T09:00:00Z',
    end_date: '2024-04-01T17:00:00Z'
  };

  it('should create a new mission', async () => {
    const res = await request(app)
      .post('/api/missions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testMission);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    missionId = res.body.id;
  });

  it('should get all missions', async () => {
    const res = await request(app)
      .get('/api/missions');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get mission by id', async () => {
    const res = await request(app)
      .get(`/api/missions/${missionId}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(testMission.title);
  });

  it('should update mission status', async () => {
    const res = await request(app)
      .put(`/api/missions/${missionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'published' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('published');
  });

  it('should delete mission', async () => {
    const res = await request(app)
      .delete(`/api/missions/${missionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(204);
  });
});