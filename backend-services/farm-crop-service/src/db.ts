import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('FarmCrop Service FATAL: DATABASE_URL environment variable is not set or not loaded.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Necessary for Neon
  }
});

pool.on('connect', () => {
  console.log('FarmCrop Service connected to the Neon PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('FarmCrop Service: Unexpected error on idle client with Neon DB', err);
  process.exit(-1);
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// SQL for creating the farms and fields tables (run this in your Neon SQL editor)
/*
CREATE TABLE farms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address_text TEXT,
  -- For PostGIS: location_point GEOMETRY(Point, 4326),
  -- For PostGIS: boundary_geojson GEOMETRY(Polygon, 4326),
  -- Using JSONB for GeoJSON if PostGIS is not enabled/used yet:
  location_point_geojson JSONB, -- Store GeoJSON Point for a central farm location
  boundary_geojson JSONB, -- Store GeoJSON Polygon/MultiPolygon for farm boundary
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fields (
  id SERIAL PRIMARY KEY,
  farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(255), -- e.g., "North Field", "Plot A"
  crop_type VARCHAR(100) NOT NULL,
  planting_date DATE,
  soil_type VARCHAR(100),
  irrigation_method VARCHAR(100),
  -- For PostGIS: boundary_geojson GEOMETRY(Polygon, 4326),
  -- Using JSONB for GeoJSON:
  boundary_geojson JSONB, -- Store GeoJSON Polygon/MultiPolygon for field boundary
  area_hectares NUMERIC(10,2), -- Optional, can be calculated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an updated_at trigger function for farms and fields
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_farms_timestamp
BEFORE UPDATE ON farms
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_fields_timestamp
BEFORE UPDATE ON fields
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
*/
