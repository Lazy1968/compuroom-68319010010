const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { query, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint (Required by exam spec)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    service: 'compuroom-api',
    author: 'นายพีระพัฒน์ คำแหงพล (68319010010)',
    timestamp: new Date().toISOString()
  });
});

// 1. GET /api/computers - Get all computers (with optional filter & search)
app.get('/api/computers', async (req, res, next) => {
  try {
    const { status, room, search } = req.query;
    let sql = 'SELECT * FROM computers WHERE 1=1';
    const params = [];

    if (status && status !== 'ทั้งหมด') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (room && room !== 'ทั้งหมด') {
      params.push(room);
      sql += ` AND room = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (asset_code ILIKE $${params.length} OR brand_model ILIKE $${params.length} OR cpu ILIKE $${params.length} OR room ILIKE $${params.length})`;
    }

    sql += ' ORDER BY id ASC';

    const result = await query(sql, params);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/computers/:id - Get computer by ID
app.get('/api/computers/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'รหัส ID ต้องเป็นตัวเลขจำนวนเต็ม' });
    }

    const result = await query('SELECT * FROM computers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `ไม่พบข้อมูลคอมพิวเตอร์รหัส ID: ${id}` });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/computers - Create new computer record
app.post('/api/computers', async (req, res, next) => {
  try {
    const { asset_code, brand_model, cpu, ram_gb, room, status } = req.body;

    // Validation
    if (!asset_code || !brand_model || !cpu || ram_gb === undefined || !room) {
      return res.status(400).json({
        error: 'กรุณากรอกข้อมูลให้ครบถ้วน (asset_code, brand_model, cpu, ram_gb, room)'
      });
    }

    const ramNum = parseInt(ram_gb, 10);
    if (isNaN(ramNum) || ramNum <= 0) {
      return res.status(400).json({ error: 'ram_gb ต้องเป็นตัวเลขมากกว่า 0' });
    }

    const validStatuses = ['ใช้งาน', 'ส่งซ่อม', 'จำหน่าย'];
    const finalStatus = status && validStatuses.includes(status) ? status : 'ใช้งาน';

    // Check duplicate asset_code
    const checkDuplicate = await query('SELECT id FROM computers WHERE asset_code = $1', [asset_code.trim()]);
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: `รหัสครุภัณฑ์ "${asset_code}" มีอยู่ในระบบแล้ว` });
    }

    const insertSql = `
      INSERT INTO computers (asset_code, brand_model, cpu, ram_gb, room, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      asset_code.trim(),
      brand_model.trim(),
      cpu.trim(),
      ramNum,
      room.trim(),
      finalStatus
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 4. PUT /api/computers/:id - Update computer record
app.put('/api/computers/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'รหัส ID ต้องเป็นตัวเลขจำนวนเต็ม' });
    }

    const { asset_code, brand_model, cpu, ram_gb, room, status } = req.body;

    // Validation
    if (!asset_code || !brand_model || !cpu || ram_gb === undefined || !room) {
      return res.status(400).json({
        error: 'กรุณากรอกข้อมูลให้ครบถ้วน (asset_code, brand_model, cpu, ram_gb, room)'
      });
    }

    const ramNum = parseInt(ram_gb, 10);
    if (isNaN(ramNum) || ramNum <= 0) {
      return res.status(400).json({ error: 'ram_gb ต้องเป็นตัวเลขมากกว่า 0' });
    }

    const validStatuses = ['ใช้งาน', 'ส่งซ่อม', 'จำหน่าย'];
    const finalStatus = status && validStatuses.includes(status) ? status : 'ใช้งาน';

    // Check if ID exists
    const checkExist = await query('SELECT id FROM computers WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: `ไม่พบข้อมูลคอมพิวเตอร์รหัส ID: ${id}` });
    }

    // Check duplicate asset_code on another record
    const checkDuplicate = await query('SELECT id FROM computers WHERE asset_code = $1 AND id != $2', [
      asset_code.trim(),
      id
    ]);
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: `รหัสครุภัณฑ์ "${asset_code}" ถูกใช้โดยเครื่องอื่นแล้ว` });
    }

    const updateSql = `
      UPDATE computers
      SET asset_code = $1,
          brand_model = $2,
          cpu = $3,
          ram_gb = $4,
          room = $5,
          status = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;

    const result = await query(updateSql, [
      asset_code.trim(),
      brand_model.trim(),
      cpu.trim(),
      ramNum,
      room.trim(),
      finalStatus,
      id
    ]);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /api/computers/:id - Delete computer record
app.delete('/api/computers/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'รหัส ID ต้องเป็นตัวเลขจำนวนเต็ม' });
    }

    const result = await query('DELETE FROM computers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `ไม่พบข้อมูลคอมพิวเตอร์รหัส ID: ${id}` });
    }

    res.status(200).json({
      message: 'ลบข้อมูลคอมพิวเตอร์เรียบร้อยแล้ว',
      deleted: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server if not imported by test suite
if (process.env.NODE_ENV !== 'test') {
  initDb().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('=========================================');
      console.log(`🚀 Compuroom API Server running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📦 Resource API: http://localhost:${PORT}/api/computers`);
      console.log('=========================================');
    });
  });
}

module.exports = app;
