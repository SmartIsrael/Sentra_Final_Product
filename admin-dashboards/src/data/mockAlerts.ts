// NOTE: The mockAlerts array below is NOT compatible with this updated Alert interface.
// It would need to be updated (e.g., string IDs to numbers, field name changes)
// if it were to be used. For now, focus is on API integration.

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
export type AlertType = "pest" | "weather" | "system" | "crop_health" | string; // Allow other string types from backend

export interface Alert {
  id: number; // Changed from string
  alert_type: AlertType; // Renamed from 'type', broadened type
  severity: AlertSeverity;
  message: string; // Was 'description'. Frontend 'title' can be part of 'message' or 'details'.
  details?: any; // To store additional info, potentially including the original 'title'
  status: AlertStatus; // Direct from backend
  
  farmer_id?: number; // Renamed from farmerId, type changed
  device_id?: number; // Renamed from deviceId, type changed
  farm_id?: number; // Added from backend possibility
  field_id?: number; // Added from backend possibility
  created_by_user_id?: number; // Added from backend possibility

  created_at: string; // Was 'date'. Backend sends Date, JSON stringifies to string.
  updated_at?: string; // Added from backend possibility
  acknowledged_at?: string | null; // Was acknowledgedTimestamp
  resolved_at?: string | null; // Was resolvedTimestamp

  // Frontend-derived convenience properties (can be added in the hook if needed):
  // title?: string; 
  // isActive?: boolean;
  // isAcknowledged?: boolean;
}

export const mockAlerts: any[] = [ // Changed to any[] to avoid immediate type errors with old data
  // Active Alerts (mix of types)
  { id: "alert-001", type: "pest", severity: "high", title: "Locust Swarm Detected", description: "Large locust swarm reported near Field A.", date: "2025-04-28", isActive: true, farmerId: "farmer-001" },
  { id: "alert-002", type: "weather", severity: "medium", title: "Heavy Rainfall Expected", description: "Forecast predicts heavy rainfall in the next 24 hours.", date: "2025-04-29", isActive: true },
  { id: "alert-003", type: "crop_health", severity: "high", title: "Blight Detected in Potatoes", description: "Signs of late blight in potato crops in Northern Province.", date: "2025-04-27", isActive: true, farmerId: "farmer-003" },
  { id: "alert-004", type: "system", severity: "low", title: "Sensor Battery Low", description: "Sensor #XYZ-789 battery below 20%.", date: "2025-04-29", isActive: true, deviceId: "device-007" },
  { id: "alert-005", type: "pest", severity: "medium", title: "Aphid Infestation", description: "Aphids found on maize crops.", date: "2025-04-28", isActive: true, farmerId: "farmer-001" },
  
  // Some more pest detections (some active, some not for variety)
  { id: "alert-006", type: "pest", severity: "low", title: "Fall Armyworm", description: "Early signs of Fall Armyworm.", date: "2025-04-26", isActive: true, farmerId: "farmer-002" },
  { id: "alert-007", type: "pest", severity: "high", title: "Stem Borer", description: "Stem borer damage on sorghum.", date: "2025-04-25", isActive: true, farmerId: "farmer-004" },
  { id: "alert-008", type: "pest", severity: "medium", title: "Fruit Flies", description: "Fruit flies spotted in mango orchards.", date: "2025-04-20", isActive: false, farmerId: "farmer-005" },

  // Some more weather alerts (some active, some not)
  { id: "alert-009", type: "weather", severity: "high", title: "Strong Winds Advisory", description: "Strong winds expected, secure loose items.", date: "2025-04-27", isActive: true },
  { id: "alert-010", type: "weather", severity: "low", title: "Cooler Temperatures", description: "Night temperatures expected to drop.", date: "2025-04-28", isActive: true },
  { id: "alert-011", type: "weather", severity: "medium", title: "Drought Warning", description: "Extended dry period, consider irrigation.", date: "2025-04-15", isActive: false },
  
  // For a total of 17 active alerts as in the original hardcoded data
  { id: "alert-012", type: "crop_health", severity: "medium", title: "Nutrient Deficiency", description: "Yellowing leaves indicate possible nitrogen deficiency.", date: "2025-04-29", isActive: true },
  { id: "alert-013", type: "system", severity: "medium", title: "Intermittent Connectivity", description: "Device #ABC-123 reporting intermittent connectivity.", date: "2025-04-28", isActive: true },
  { id: "alert-014", type: "pest", severity: "high", title: "Rodent Activity", description: "Increased rodent activity reported in storage units.", date: "2025-04-29", isActive: true },
  { id: "alert-015", type: "weather", severity: "medium", title: "High Humidity", description: "High humidity levels may promote fungal growth.", date: "2025-04-29", isActive: true },
  { id: "alert-016", type: "crop_health", severity: "low", title: "Weed Growth", description: "Significant weed growth in Field B.", date: "2025-04-27", isActive: true },
  { id: "alert-017", type: "system", severity: "high", title: "Irrigation System Malfunction", description: "Main irrigation pump non-responsive.", date: "2025-04-28", isActive: true },
  { id: "alert-018", type: "pest", severity: "medium", title: "Whiteflies", description: "Whiteflies detected on tomato plants.", date: "2025-04-29", isActive: true },
  { id: "alert-019", type: "weather", severity: "low", title: "Optimal Growing Conditions", description: "Favorable weather for most crops.", date: "2025-04-29", isActive: true }, // This makes it 17 active alerts
];
