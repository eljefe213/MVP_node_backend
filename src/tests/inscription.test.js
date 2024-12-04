import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { setupTestDatabase, clearTestDatabase } from './setup.js';
import { Mission, User, Inscription } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

describe('Inscription Endpoints', () => {
  let authToken;
  let missionId;
  let userId;
  let missionCreatorToken;
  let creatorId;
  let testMission;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create mission creator user
    const creatorUser = await User.create({
      username: 'missioncreator',
      email: 'creator@test.com',
      password: 'password123',
      skills: 'Testing',
      availability: 'Always',
      role: 'admin'
    });
    
    creatorId = creatorUser.id;
    missionCreatorToken = jwt.sign({ id: creatorId }, config.jwtSecret);

    // Create test user
    const testUser = await User.create({
      username: 'inscriptiontester',
      email: 'inscription@test.com',
      password: 'password123',
      skills: 'Testing',
      availability: 'Always'
    });

    userId = testUser.id;
    authToken = jwt.sign({ id: userId }, config.jwtSecret);

    // Create a test mission
    testMission = await Mission.create({
      title: 'Test Mission',
      description: 'Test Description',
      location: 'Test Location',
      start_date: '2024-04-01T09:00:00Z',
      end_date: '2024-04-01T17:00:00Z',
      status: 'published',
      userId: creatorId
    });

    missionId = testMission.id;
  });

  afterAll(async () => {
    await clearTestDatabase();
  });

  it('should create a new inscription', async () => {
    const res = await request(app)
      .post(`/api/inscriptions/${missionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ hours: 8 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.hours).toBe(8);
    expect(res.body.status).toBe('pending');
  });

  it('should not create duplicate inscription', async () => {
    const res = await request(app)
      .post(`/api/inscriptions/${missionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ hours: 8 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Already inscribed to this mission');
  });

  it('should get mission inscriptions', async () => {
    const res = await request(app)
      .get(`/api/inscriptions/mission/${missionId}`)
      .set('Authorization', `Bearer ${missionCreatorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user inscriptions', async () => {
    const res = await request(app)
      .get('/api/inscriptions/user')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update inscription status', async () => {
    const inscription = await Inscription.create({
      userId,
      missionId,
      hours: 4,
      status: 'pending'
    });

    const res = await request(app)
      .put(`/api/inscriptions/${inscription.id}`)
      .set('Authorization', `Bearer ${missionCreatorToken}`)
      .send({ status: 'accepted' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');
  });

  it('should cancel inscription', async () => {
    const inscription = await Inscription.create({
      userId,
      missionId,
      hours: 4,
      status: 'pending'
    });

    const res = await request(app)
      .delete(`/api/inscriptions/${inscription.id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(204);
  });
});