const request = require('supertest');
const { app } = require('../app');

describe('API Integration Tests', () => {
  describe('GET /', () => {
    test('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Welcome to CI/CD Demo API');
    });
  });

  describe('GET /health', () => {
    test('should return healthy status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
    });
  });

  describe('POST /api/calculate', () => {
    test('should calculate addition correctly', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'add', a: 5, b: 3 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(8);
    });

    test('should return 400 for missing parameters', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'add', a: 5 });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing parameters');
    });

    test('should handle division by zero', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({ operation: 'divide', a: 10, b: 0 });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Division by zero');
    });
  });

  describe('User API', () => {
    test('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', email: 'john@example.com' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('John Doe');
    });

    test('should return 400 when missing user data', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe' });
      
      expect(response.status).toBe(400);
    });

    test('should get all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});