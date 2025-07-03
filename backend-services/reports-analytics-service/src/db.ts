import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Construct an absolute path to the .env file in the backend-services directory
const envPath = path.resolve(__dirname, '..', '..', '.env');
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  console.error(`ReportsAnalytics Service: Error loading .env file from ${envPath}:`, dotenvResult.error);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ReportsAnalytics Service FATAL: DATABASE_URL environment variable is not set or not loaded.');
  console.error('Please ensure it is set in:', envPath);
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Necessary for Neon
  }
});

pool.on('connect', () => {
  console.log('ReportsAnalytics Service connected to the Neon PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('ReportsAnalytics Service: Unexpected error on idle client with Neon DB', err);
  process.exit(-1);
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// ythis service will primarily query existing tables.
// if it needs its own tables for aggregated data or report definitions,
// those schemas would go here. For now, we assume it reads from other services' tables.
/*
Example:
CREATE TABLE report_definitions (
  id SERIAL PRIMARY KEY,
  report_name VARCHAR(255) UNIQUE NOT NULL,
  query_template TEXT NOT NULL, -- SQL template for the report
  parameters JSONB, -- Default parameters or schema for parameters
  created_by_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/
