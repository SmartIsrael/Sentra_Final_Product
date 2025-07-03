export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'farmer';
  created_at: string; // Dates are typically strings after JSON serialization
  // Farmer-specific fields (optional for admin)
  phone_number?: string;
  location_address?: string;
  location_lat?: number;
  location_lon?: number;
}

export type DeviceStatus = 'active' | 'inactive' | 'error' | 'maintenance' | 'decommissioned';

export interface Device {
  id: number;
  serial_number?: string | null;
  // device_type removed
  model?: string | null;
  manufacturer?: string | null;
  firmware_version?: string | null;
  status: DeviceStatus;
  farm_id?: number | null;
  farmer_id: number; // Now required
  location_lat: number; // Now required
  location_lon: number; // Now required
  config_params?: Record<string, any> | null; // JSONB, assuming object structure
  registered_at: string; // Dates are typically strings after JSON serialization
  last_seen_at?: string | null; // Dates are typically strings after JSON serialization
  name: string;
  battery: number;
  signalStrength: number;
}

export interface FarmerReport {
  id: string;
  farmerId: string;
  cropType: string;
  reportType: string;
  date?: string;
  status: "Critical" | "Resolved" | "Pending" | "In Progress" | "Information";
  title?: string; // Assuming title exists
}

// We can add other shared types here later, e.g., for FarmerProfile etc.
// For now, the Alert types are in data/mockAlerts.ts, which is fine.
