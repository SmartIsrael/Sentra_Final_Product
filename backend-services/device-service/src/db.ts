import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL: DATABASE_URL environment variable is not set or not loaded.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Necessary for Neon
  }
} as any); // Using 'as any' to allow underlying pg options like 'family'

pool.on('connect', () => {
  console.log('Device Service connected to the Neon PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Device Service: Unexpected error on idle client with Neon DB', err);
  process.exit(-1);
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// Example SQL for creating the devices table (run this in your Neon SQL editor)
/*
CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  serial_number VARCHAR(255) UNIQUE,
  device_type VARCHAR(100) NOT NULL,
  model VARCHAR(100),
  manufacturer VARCHAR(100),
  firmware_version VARCHAR(50),
  status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'maintenance', 'decommissioned')),
  api_key_hash VARCHAR(255), -- For device-specific authentication if needed
  farm_id INTEGER, -- Optional: Foreign key to a farms table
  farmer_id INTEGER REFERENCES users(id), -- Foreign key to the users table
  location_lat DECIMAL(9,6),
  location_lon DECIMAL(9,6),
  config_params JSONB,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP WITH TIME ZONE
);
*/
