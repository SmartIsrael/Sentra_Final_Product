export interface FieldVisit {
  id: string;
  farmerId: string; // Link to Farmer.id
  scheduledDate: string; // ISO date string for the visit
  actualDate?: string; // ISO date string, if different or when completed
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "Postponed";
  purpose: string; // e.g., "Soil Sampling", "Pest Scouting", "Training"
  notes?: string; // Notes from the extension officer
  assignedOfficerId?: string; // ID of the extension officer
}

export const mockFieldVisits: FieldVisit[] = [
  {
    id: "visit-001",
    farmerId: "farmer-001",
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: "Scheduled",
    purpose: "Follow-up on Fall Armyworm report (report-001)",
    assignedOfficerId: "officer-A",
  },
  {
    id: "visit-002",
    farmerId: "farmer-002",
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    actualDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Completed",
    purpose: "Routine checkup and soil sampling",
    notes: "Collected soil samples from Plot B. Farmer requested info on new tea variants.",
    assignedOfficerId: "officer-B",
  },
  {
    id: "visit-003",
    farmerId: "farmer-003",
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: "Scheduled",
    purpose: "Investigate suspected Potassium Deficiency (report-003)",
    assignedOfficerId: "officer-A",
  },
  {
    id: "visit-004",
    farmerId: "farmer-004",
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: "Postponed",
    purpose: "Training session on rice planting techniques",
    notes: "Farmer requested postponement due to personal reasons.",
    assignedOfficerId: "officer-C",
  },
  {
    id: "visit-005",
    farmerId: "farmer-001",
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    status: "Scheduled",
    purpose: "General farm advisory visit",
    assignedOfficerId: "officer-B",
  },
];
