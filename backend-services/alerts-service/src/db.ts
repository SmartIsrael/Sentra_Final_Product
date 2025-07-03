import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Alerts Service FATAL: DATABASE_URL environment variable is not set or not loaded.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Necessary for Neon
  }
});

pool.on('connect', () => {
  console.log('Alerts Service connected to the Neon PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Alerts Service: Unexpected error on idle client with Neon DB', err);
  process.exit(-1);
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// SQL for creating the alerts table (run this in your Neon SQL editor)
/*
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_status AS ENUM ('new', 'acknowledged', 'in_progress', 'resolved', 'closed');

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  alert_type VARCHAR(100) NOT NULL, -- e.g., 'DEVICE_MALFUNCTION', 'PEST_DETECTED', 'LOW_SOIL_MOISTURE'
  severity alert_severity NOT NULL DEFAULT 'medium',
  message TEXT NOT NULL,
  status alert_status NOT NULL DEFAULT 'new',
  details JSONB, -- For any extra structured data related to the alert

  farmer_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- User primarily affected/notified
  device_id INTEGER REFERENCES devices(id) ON DELETE SET NULL, -- Related device, if any
  farm_id INTEGER REFERENCES farms(id) ON DELETE SET NULL,     -- Related farm, if any
  field_id INTEGER REFERENCES fields(id) ON DELETE SET NULL,   -- Related field, if any

  created_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- If manually created by an admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Optional: Trigger for updated_at (if not already created by another service)
-- CREATE OR REPLACE FUNCTION trigger_set_timestamp() ...
-- CREATE TRIGGER set_alerts_timestamp BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
*/
