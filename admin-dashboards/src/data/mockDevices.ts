export interface Device {
  id: string;
  name: string;
  location: string; // Could be GPS coordinates or a descriptive location
  status: "online" | "offline" | "maintenance";
  battery: number; // Percentage
  signalStrength: number; // Percentage, renamed from 'signal' for clarity
  lastSyncTimestamp: string; // ISO date string
  farmerId?: string; // Optional: link to a farmer
  type: string; // e.g., "Soil Sensor", "Weather Station"
}

export const mockDevices: Device[] = [
  {
    id: "device-001",
    name: "Field Station Alpha",
    location: "Plot A-1, North Sector",
    status: "online",
    battery: 85,
    signalStrength: 92,
    lastSyncTimestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    farmerId: "farmer-001",
    type: "Weather Station"
  },
  {
    id: "device-002",
    name: "Soil Sensor Beta",
    location: "Plot B-3, East Sector",
    status: "online",
    battery: 67,
    signalStrength: 78,
    lastSyncTimestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    farmerId: "farmer-002",
    type: "Soil Sensor"
  },
  {
    id: "device-003",
    name: "Water Pump Gamma",
    location: "Irrigation Point, South Sector",
    status: "offline",
    battery: 23, // Assumed last known battery
    signalStrength: 0, // Assumed last known signal
    lastSyncTimestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    type: "Irrigation Control"
  },
  {
    id: "device-004",
    name: "Drone Delta",
    location: "Hangar, West Sector",
    status: "maintenance",
    battery: 50,
    signalStrength: 45,
    lastSyncTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    farmerId: "farmer-004",
    type: "Aerial Drone"
  },
  {
    id: "device-005",
    name: "Field Station Epsilon",
    location: "Plot C-2, Central Region",
    status: "online",
    battery: 95,
    signalStrength: 88,
    lastSyncTimestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    type: "Weather Station"
  }
];
