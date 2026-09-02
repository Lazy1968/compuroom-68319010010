const request = require('supertest');
const db = require('../db');

// Mock db.query so unit tests can run anywhere (CI / local) reliably
jest.mock('../db', () => {
  const original = jest.requireActual('../db');
  return {
    ...original,
    query: jest.fn(),
    initDb: jest.fn().mockResolvedValue(true)
  };
});

const app = require('../index');

describe('DevOps Midterm Exam - Backend API Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Health Check Endpoint
  describe('GET /health', () => {
    it('should return 200 OK with system status, version and author', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('version', '1.0.0');
      expect(res.body).toHaveProperty('service', 'compuroom-api');
      expect(res.body).toHaveProperty('author');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // Test 2: GET /api/computers (Get All)
  describe('GET /api/computers', () => {
    it('should return 200 and a list of computers', async () => {
      const mockComputers = [
        {
          id: 1,
          asset_code: 'COM-LAB1-01',
          brand_model: 'Dell OptiPlex 7090',
          cpu: 'Intel Core i7-11700',
          ram_gb: 16,
          room: 'Lab 101',
          status: 'ใช้งาน'
        },
        {
          id: 2,
          asset_code: 'COM-LAB1-02',
          brand_model: 'HP ProDesk 400 G7',
          cpu: 'Intel Core i5-10500',
          ram_gb: 8,
          room: 'Lab 101',
          status: 'ใช้งาน'
        }
      ];

      db.query.mockResolvedValueOnce({ rows: mockComputers });

      const res = await request(app).get('/api/computers');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].asset_code).toBe('COM-LAB1-01');
    });
  });

  // Test 3: POST /api/computers (Create successfully)
  describe('POST /api/computers', () => {
    it('should create a new computer record and return 201 Created', async () => {
      const newComputer = {
        asset_code: 'COM-LAB2-99',
        brand_model: 'Lenovo ThinkCentre M70s',
        cpu: 'AMD Ryzen 5 PRO 4650G',
        ram_gb: 16,
        room: 'Lab 102',
        status: 'ใช้งาน'
      };

      // 1st query: check duplicate -> empty
      db.query.mockResolvedValueOnce({ rows: [] });
      // 2nd query: insert -> return created record
      db.query.mockResolvedValueOnce({
        rows: [{ id: 3, ...newComputer, created_at: new Date().toISOString() }]
      });

      const res = await request(app)
        .post('/api/computers')
        .send(newComputer);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id', 3);
      expect(res.body.asset_code).toBe('COM-LAB2-99');
      expect(res.body.status).toBe('ใช้งาน');
    });

    it('should return 400 Bad Request when required fields are missing', async () => {
      const invalidData = {
        asset_code: 'COM-INCOMPLETE'
        // Missing brand_model, cpu, ram_gb, room
      };

      const res = await request(app)
        .post('/api/computers')
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test 4: GET /api/computers/:id (Not Found 404 test)
  describe('GET /api/computers/:id', () => {
    it('should return 404 Not Found when computer id does not exist', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/api/computers/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test 5: DELETE /api/computers/:id (Not Found 404 test)
  describe('DELETE /api/computers/:id', () => {
    it('should return 404 Not Found when trying to delete non-existent ID', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).delete('/api/computers/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
