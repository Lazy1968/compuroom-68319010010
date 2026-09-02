const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'compuroom',
  connectionTimeoutMillis: 5000,
});

// Helper for database queries
const query = (text, params) => pool.query(text, params);

// Initialize table & seed initial sample data
const initDb = async (retries = 5, delay = 2000) => {
  if (process.env.NODE_ENV === 'test') {
    return; // Tests can manage their own setup/mocks
  }

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Connecting to PostgreSQL database: ${process.env.DB_NAME || 'compuroom'} (attempt ${i + 1}/${retries})...`);
      
      // Create table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS computers (
          id SERIAL PRIMARY KEY,
          asset_code VARCHAR(50) UNIQUE NOT NULL,
          brand_model VARCHAR(100) NOT NULL,
          cpu VARCHAR(100) NOT NULL,
          ram_gb INTEGER NOT NULL,
          room VARCHAR(50) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'ใช้งาน',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Check if sample data exists
      const countRes = await pool.query('SELECT COUNT(*) FROM computers');
      if (parseInt(countRes.rows[0].count, 10) === 0) {
        console.log('Seeding initial computer records...');
        await pool.query(`
          INSERT INTO computers (asset_code, brand_model, cpu, ram_gb, room, status)
          VALUES 
            ('COM-LAB1-01', 'Dell OptiPlex 7090', 'Intel Core i7-11700', 16, 'Lab 101', 'ใช้งาน'),
            ('COM-LAB1-02', 'HP ProDesk 400 G7', 'Intel Core i5-10500', 8, 'Lab 101', 'ใช้งาน'),
            ('COM-LAB2-01', 'Lenovo ThinkCentre M70s', 'AMD Ryzen 5 PRO 4650G', 16, 'Lab 102', 'ส่งซ่อม'),
            ('COM-LAB3-01', 'Acer Veriton M4660G', 'Intel Core i3-9100', 8, 'Lab 103', 'จำหน่าย')
        `);
      }

      console.log('Database initialized successfully.');
      return;
    } catch (err) {
      console.warn(`Database connection attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('Could not connect to PostgreSQL after multiple attempts. Application will continue, but DB operations might fail until connection is restored.');
      }
    }
  }
};

module.exports = {
  pool,
  query,
  initDb
};
