import { Pool } from 'pg';

// Get the Neon connection string from an environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FATAL: DATABASE_URL environment variable is not set.');
  console.error('Please set it to your Neon PostgreSQL connection string.');
  console.error('Example: postgres://user:password@host:port/dbname?sslmode=require');
  process.exit(1); // Exit if the connection string is not found
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Necessary for Neon if you don't have the CA cert configured locally
                               // For production, consider more secure SSL configurations if possible
  },
  // family: 4 // Prefer IPv4 - This caused a TS error, let's try another way if needed.
  // For now, let's assume the issue might be resolvable by Docker's DNS or if Neon's pooler handles it.
  // If ENETUNREACH persists, we might need to parse the connectionString and add 'family' to the host object.
} as any); // Using 'as any' to bypass strict type checking for less common options like 'family' if pg supports it underneath.

pool.on('connect', () => {
  console.log('Connected to the Neon PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client with Neon DB', err);
  process.exit(-1);
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// The users table should be created directly in your Neon SQL editor:
/*
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('admin', 'farmer')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/
